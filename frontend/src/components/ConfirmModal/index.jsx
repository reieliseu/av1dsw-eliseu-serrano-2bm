import React from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-2">{title || "Confirmar"}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
