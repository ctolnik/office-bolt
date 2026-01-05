import { useState } from "react";
import { Settings, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgentConfigModal } from "@/components/agents/AgentConfigModal";
import { useAgents, useDeleteAgent } from "@/hooks/useAgents";
import { formatRelativeTime, getStatusColor } from "@/utils/formatters";

export default function Agents() {
  const { data: agents, isLoading } = useAgents();
  const deleteAgent = useDeleteAgent();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  const filteredAgents = agents?.filter(agent => {
    const matchesSearch = 
      agent.computer_name.toLowerCase().includes(search.toLowerCase()) ||
      agent.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleOpenConfig = (computerName: string) => {
    setSelectedAgent(computerName);
    setConfigModalOpen(true);
  };

  const handleOpenDelete = (computerName: string) => {
    setSelectedAgent(computerName);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteAgent.mutate(selectedAgent);
    setDeleteDialogOpen(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Онлайн';
      case 'offline': return 'Оффлайн';
      case 'idle': return 'Простой';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Агенты</h1>
        <p className="text-muted-foreground mt-1">
          Управление агентами мониторинга
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Поиск по имени компьютера или пользователя..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            Все
          </Button>
          <Button
            variant={statusFilter === "online" ? "default" : "outline"}
            onClick={() => setStatusFilter("online")}
          >
            Онлайн
          </Button>
          <Button
            variant={statusFilter === "offline" ? "default" : "outline"}
            onClick={() => setStatusFilter("offline")}
          >
            Оффлайн
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Статус</TableHead>
              <TableHead>Компьютер</TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>IP адрес</TableHead>
              <TableHead>ОС</TableHead>
              <TableHead>Версия агента</TableHead>
              <TableHead>Последняя активность</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Агенты не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.computer_name}>
                  <TableCell>
                    <Badge className={getStatusColor(agent.status)}>
                      {getStatusText(agent.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{agent.computer_name}</TableCell>
                  <TableCell>{agent.username}</TableCell>
                  <TableCell>{agent.ip_address}</TableCell>
                  <TableCell>{agent.os_version}</TableCell>
                  <TableCell>{agent.agent_version}</TableCell>
                  <TableCell>{formatRelativeTime(agent.last_seen)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenConfig(agent.computer_name)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(agent.computer_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAgent && (
        <AgentConfigModal
          computerName={selectedAgent}
          open={configModalOpen}
          onOpenChange={setConfigModalOpen}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить агента?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит конфигурацию агента. Исторические данные останутся в системе.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
