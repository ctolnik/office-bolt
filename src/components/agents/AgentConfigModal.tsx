import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";
import { useAgentConfig, useUpdateAgentConfig } from "@/hooks/useAgents";
import type { AgentConfig } from "@/types";

interface AgentConfigModalProps {
  computerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentConfigModal({ computerName, open, onOpenChange }: AgentConfigModalProps) {
  const { data: config, isLoading } = useAgentConfig(computerName);
  const updateConfig = useUpdateAgentConfig();
  const [formData, setFormData] = useState<AgentConfig>({
    screenshot_interval: 60,
    activity_tracking: true,
    keylogger_enabled: false,
    usb_monitoring: true,
    file_monitoring: true,
    dlp_enabled: true,
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate({ computerName, config: formData });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Конфигурация агента: {computerName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Загрузка...</div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Интервал скриншотов: {formData.screenshot_interval}с</Label>
              <Slider
                value={[formData.screenshot_interval]}
                onValueChange={([value]) => setFormData({ ...formData, screenshot_interval: value })}
                min={10}
                max={300}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                От 10 до 300 секунд
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="activity-tracking">Отслеживание активности</Label>
              <Switch
                id="activity-tracking"
                checked={formData.activity_tracking}
                onCheckedChange={(checked) => setFormData({ ...formData, activity_tracking: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="keylogger">Клавиатурный логгер</Label>
                {formData.keylogger_enabled && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <Switch
                id="keylogger"
                checked={formData.keylogger_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, keylogger_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="usb-monitoring">Мониторинг USB</Label>
              <Switch
                id="usb-monitoring"
                checked={formData.usb_monitoring}
                onCheckedChange={(checked) => setFormData({ ...formData, usb_monitoring: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="file-monitoring">Мониторинг файлов</Label>
              <Switch
                id="file-monitoring"
                checked={formData.file_monitoring}
                onCheckedChange={(checked) => setFormData({ ...formData, file_monitoring: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dlp">DLP защита</Label>
              <Switch
                id="dlp"
                checked={formData.dlp_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, dlp_enabled: checked })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={updateConfig.isPending}>
                Сохранить
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
