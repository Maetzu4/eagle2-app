// src/components/Admin/usuarioForm.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { Usuario, Sede } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import * as bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 10; // Coste computacional para el hashing (10-12 recomendado)

interface UsuarioFormProps {
  formData: Usuario;
  onInputChange: (name: string, value: string | number) => void;
  onSubmit: (formData: Usuario) => Promise<void>;
  isEditMode: boolean;
  sedes: Sede[];
}

export function UsuarioForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  sedes,
}: UsuarioFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (pass: string): boolean => {
    if (!isEditMode && pass.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (pass.length > 0 && pass.length < 8) {
      setPasswordError("Mínimo 8 caracteres");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) return;

    setIsSubmitting(true);

    try {
      const userData = { ...formData };

      // Solo hashear si es nuevo usuario o si se cambió la contraseña
      if (!isEditMode || password) {
        if (!isEditMode && !password) {
          throw new Error("La contraseña es requerida");
        }
        if (password) {
          userData.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        }
      }

      await onSubmit(userData);

      toast({
        title: "Éxito",
        description: `Usuario ${
          isEditMode ? "actualizado" : "creado"
        } correctamente`,
        variant: "default",
      });

      if (!isEditMode) {
        // Resetear formulario después de creación exitosa
        setPassword("");
        onInputChange("name", "");
        onInputChange("lastname", "");
        onInputChange("email", "");
        onInputChange("role", "checkinero");
        onInputChange("sedeId", "");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: string | number) => {
    onInputChange(name, value);
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre*</Label>
            <Input
              id="name"
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Apellido */}
          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido*</Label>
            <Input
              id="lastname"
              type="text"
              value={formData.lastname || ""}
              onChange={(e) => handleChange("lastname", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={isEditMode || isSubmitting}
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditMode ? "Nueva Contraseña" : "Contraseña*"}
              {isEditMode && (
                <span className="text-gray-500 ml-1">(opcional)</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder={
                  isEditMode ? "Dejar en blanco para no cambiar" : ""
                }
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {!passwordError && (
              <p className="text-sm text-gray-500">
                Mínimo 8 caracteres {isEditMode && "(opcional)"}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol*</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
              required
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkinero">Checkinero</SelectItem>
                <SelectItem value="digitador">Digitador</SelectItem>
                <SelectItem value="operario">Operario</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sede */}
          <div className="space-y-2">
            <Label htmlFor="sedeId">Sede</Label>
            <Select
              value={formData.sedeId?.toString() || ""}
              onValueChange={(value) =>
                handleChange("sedeId", value ? parseInt(value) : null)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin sede asignada</SelectItem>
                {sedes.map((sede) => (
                  <SelectItem key={sede.idSede} value={sede.idSede.toString()}>
                    {sede.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estado (solo en edición) */}
        {isEditMode && (
          <div className="flex items-center space-x-4 pt-2">
            <Label>Estado:</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "Activo"}
                  onChange={() => handleChange("status", "Activo")}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  disabled={isSubmitting}
                />
                <span>Activo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "Inactivo"}
                  onChange={() => handleChange("status", "Inactivo")}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  disabled={isSubmitting}
                />
                <span>Inactivo</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 min-w-24"
            disabled={isSubmitting || (passwordError !== null && !isEditMode)}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Actualizando..." : "Creando..."}
              </span>
            ) : (
              <span>{isEditMode ? "Actualizar Usuario" : "Crear Usuario"}</span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
