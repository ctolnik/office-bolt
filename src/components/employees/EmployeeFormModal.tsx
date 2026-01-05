import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import type { Employee } from "@/types";

interface EmployeeFormModalProps {
  employee?: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeFormModal({ employee, open, onOpenChange }: EmployeeFormModalProps) {
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const isEdit = !!employee;

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    department: "",
    position: "",
    email: "",
    is_active: true,
    consent_given: false,
    consent_date: null as string | null,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username,
        full_name: employee.full_name,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        is_active: employee.is_active,
        consent_given: employee.consent_given,
        consent_date: employee.consent_date,
      });
    } else {
      setFormData({
        username: "",
        full_name: "",
        department: "",
        position: "",
        email: "",
        is_active: true,
        consent_given: false,
        consent_date: null,
      });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      consent_date: formData.consent_given && !formData.consent_date 
        ? new Date().toISOString() 
        : formData.consent_date,
    };

    if (isEdit && employee) {
      updateEmployee.mutate({ id: employee.id, employee: dataToSubmit });
    } else {
      createEmployee.mutate(dataToSubmit as any);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Полное имя *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Логин *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Отдел *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Должность *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Активен</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent_given}
              onCheckedChange={(checked) => 
                setFormData({ 
                  ...formData, 
                  consent_given: checked as boolean,
                  consent_date: checked ? new Date().toISOString() : null 
                })
              }
            />
            <Label htmlFor="consent" className="text-sm">
              Согласие на мониторинг получено
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createEmployee.isPending || updateEmployee.isPending}>
              {isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
