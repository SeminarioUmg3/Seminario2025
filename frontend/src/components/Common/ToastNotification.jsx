import { Toast, ToastContainer } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastComponent = () => (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {toasts.map(({ id, message, type }) => (
        <Toast
          key={id}
          onClose={() => removeToast(id)}
          show={true}
          delay={3000}
          autohide
          bg={type === 'success' ? 'success' : 'danger'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {type === 'success' ? '✅ Éxito' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );

  return { showToast, ToastComponent };
}
