import React, { useEffect } from 'react';
import { useAIPresenter } from "../../hooks/useAIPresenter";
import VoiceControl from "../../components/VoiceControl/VoiceControl";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

export default function Notifications() {
  const { presentCurrentPage, stopPresentation } = useAIPresenter();

  useEffect(() => {
    const timer = setTimeout(() => {
      presentCurrentPage('notificaciones');
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopPresentation();
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '240px',
        padding: '20px',
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <VoiceControl />
        <div className="container-fluid">
          <h1 className="mb-4">Notificaciones</h1>
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p>Panel de gestión de notificaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
