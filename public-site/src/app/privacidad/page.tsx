import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CINARIS',
  description: 'Política de Privacidad de CINARIS.',
};

export default function PrivacidadPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[#0b0f19] rounded-2xl p-8 md:p-12 border border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Política de Privacidad</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-neutral-300">
          <p className="text-sm text-neutral-400">Última actualización: 23 de julio de 2026</p>

          <p>En CINARIS, nos tomamos muy en serio la privacidad y protección de los datos de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos tu información personal.</p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Qué datos recopilamos</h2>
          <p>
            Cuando utilizas CINARIS, podemos recopilar la siguiente información:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de registro:</strong> Nombre, dirección de correo electrónico y contraseña cuando creas una cuenta.</li>
            <li><strong>Información de uso:</strong> Historial de visualización, películas marcadas como favoritas, búsquedas y tus interacciones en la plataforma.</li>
            <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo y otra información de diagnóstico cuando accedes al sitio.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Cómo los utilizamos</h2>
          <p>
            Utilizamos la información recopilada para los siguientes propósitos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proveer y mantener nuestro servicio.</li>
            <li>Personalizar tu experiencia, recomendando contenido basado en tus gustos.</li>
            <li>Procesar transacciones y enviar notificaciones relacionadas con tu cuenta o suscripción.</li>
            <li>Mejorar nuestra plataforma mediante el análisis del comportamiento general de nuestros usuarios.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Cookies</h2>
          <p>
            Empleamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y mantener cierta información. Las cookies se utilizan para mantener tu sesión activa, recordar tus preferencias y ofrecer análisis de tráfico. Puedes configurar tu navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie; sin embargo, si no aceptas las cookies, es posible que no puedas utilizar algunas partes de nuestro servicio.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Mercado Pago</h2>
          <p>
            Para procesar pagos y suscripciones de forma segura, CINARIS utiliza los servicios de <strong>Mercado Pago</strong> como pasarela de pago. No almacenamos la información completa de tu tarjeta de crédito o débito en nuestros servidores. Toda la información financiera y de facturación es procesada de forma encriptada directamente por Mercado Pago y se rige según su propia <a href="https://www.mercadopago.com/ayuda/terminos-y-politicas_194" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidad</a>.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Google Analytics</h2>
          <p>
            Usamos <strong>Google Analytics</strong> para comprender mejor cómo interactúan los usuarios con nuestra plataforma. Este servicio recopila información como la frecuencia con la que los usuarios visitan el sitio, qué páginas ven y otras estadísticas anónimas. Empleamos esta información única y exclusivamente para mejorar el rendimiento y el diseño de la plataforma. Puedes optar por no participar en el rastreo instalando el complemento de exclusión voluntaria de Google Analytics en tu navegador.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Derechos del usuario</h2>
          <p>
            Como usuario, tienes el derecho en todo momento a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder, actualizar o eliminar la información que tenemos sobre ti.</li>
            <li>Solicitar una copia de tus datos personales en un formato estructurado.</li>
            <li>Retirar tu consentimiento en cualquier momento cuando hayamos dependido de dicho consentimiento para procesar tu información.</li>
          </ul>
          <p>Para ejercer cualquiera de estos derechos, contáctanos a soporte@cinaris.com.</p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Seguridad de los datos</h2>
          <p>
            La seguridad de tus datos es prioritaria para nosotros. Implementamos medidas de seguridad comercialmente aceptables para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. No obstante, recuerda que ningún método de transmisión a través de Internet o método de almacenamiento electrónico es 100% seguro y no podemos garantizar su seguridad absoluta.
          </p>
        </div>
      </div>
    </div>
  );
}
