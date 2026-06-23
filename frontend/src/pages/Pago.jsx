import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Pago() {
  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState('tarjeta'); // 'tarjeta', 'yape', 'plin'
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [reserva, setReserva] = useState(null);
  const [boletoGenerado, setBoletoGenerado] = useState(null);
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Lógica de descuentos con TegriPuntos
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const cupon = localStorage.getItem('cuponActivo');

  // ==========================================
  // BÚSQUEDA PROFUNDA DEL NOMBRE DEL PASAJERO
  // ==========================================
  let nombreRealPasajero = 'Usuario Registrado';
  try {
    const sesionString = localStorage.getItem('usuarioLogueado');
    let obj = null;
    
    if (sesionString && sesionString.startsWith('{')) {
      obj = JSON.parse(sesionString);
    }
    
    let nombreEncontrado = 
      obj?.nombre || obj?.name || obj?.usuario?.nombre || obj?.user?.nombre || obj?.user?.name ||
      obj?.email?.split('@')[0] || obj?.usuario?.email?.split('@')[0];
      
    if (!nombreEncontrado && typeof sesionString === 'string' && !sesionString.startsWith('{')) {
      nombreEncontrado = sesionString.includes('@') ? sesionString.split('@')[0] : sesionString;
    }
    
    if (nombreEncontrado) {
      nombreRealPasajero = nombreEncontrado;
    }
  } catch (error) {
    console.error("Error leyendo nombre:", error);
  }

  // 1. CARGAR DATOS DE LA RESERVA
  useEffect(() => {
    const tieneSesion = localStorage.getItem('usuarioLogueado');
    if (!tieneSesion) navigate('/login');

    const datosGuardados = localStorage.getItem('reservaPendiente');
    if (datosGuardados) {
      setReserva(JSON.parse(datosGuardados));
    } else {
      navigate('/reserva');
    }
  }, [navigate]);

  // 2. CALCULAR DESCUENTOS
  useEffect(() => {
    if (!reserva) return;

    if (cupon === 'TEGRI10') {
      setDescuentoAplicado(reserva.total * 0.10);
    } else if (cupon === 'TEGRI20SOLES') {
      setDescuentoAplicado(20.00);
    } else if (cupon === 'VIAJEGRATIS') {
      setDescuentoAplicado(reserva.total);
    } else {
      setDescuentoAplicado(0);
    }
  }, [cupon, reserva]);

  // 3. INYECTAR SCRIPT DE HTML2PDF
  useEffect(() => {
    if (window.html2pdf) return;

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!reserva && !pagoExitoso) return null;

  const precioFinal = Math.max(0, (reserva?.total || 0) - descuentoAplicado);

  // PROCESAR PAGO
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesando(true);
    
    setTimeout(() => {
      const nuevoBoleto = {
        ...reserva,
        total: precioFinal,
        metodo: metodoPago,
        pasajero: String(nombreRealPasajero).toUpperCase(),
        idCompra: Math.random().toString(36).substring(2, 9).toUpperCase(),
        fechaCompra: new Date().toLocaleDateString()
      };
      
      const historialGuardado = JSON.parse(localStorage.getItem('historialViajes')) || [];
      historialGuardado.push(nuevoBoleto);
      localStorage.setItem('historialViajes', JSON.stringify(historialGuardado));
      
      setBoletoGenerado(nuevoBoleto);
      setProcesando(false);
      setPagoExitoso(true);

      localStorage.removeItem('reservaPendiente');
      localStorage.removeItem('cuponActivo');
      localStorage.removeItem('descuentoTitulo');
    }, 2500);
  };

  // ==========================================
  // FUNCIÓN SEGURA PARA DESCARGAR PDF (RESUELTO EL CONGELAMIENTO)
  // ==========================================
  const descargarBoletoPDF = () => {
    if (!boletoGenerado || descargandoPdf) return;
    
    setDescargandoPdf(true);
    setErrorMensaje('');

    if (typeof window.html2pdf === 'undefined') {
      setErrorMensaje("La librería de PDF no cargó. Abriendo impresión nativa...");
      setTimeout(() => {
        window.print(); 
        setDescargandoPdf(false);
      }, 500);
      return;
    }

    const element = document.getElementById('boleta-ticket');

    if (!element) {
        setErrorMensaje("Error interno: No se encontró el elemento de la boleta.");
        setDescargandoPdf(false);
        return;
    }

    const opciones = {
      margin:       0.3,
      filename:     `Boleta_Tegridad_${boletoGenerado.idCompra}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff'
      },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Usamos el flujo de promesas estándar de la librería
    window.html2pdf()
      .set(opciones)
      .from(element)
      .save()
      .then(() => {
        setDescargandoPdf(false);
      })
      .catch((error) => {
        console.error("Error crítico al generar PDF:", error);
        setErrorMensaje("Fallo al exportar directamente. Se abrirá la vista de impresión nativa.");
        setTimeout(() => {
          window.print();
          setDescargandoPdf(false);
        }, 500);
      });
  };

  // ==========================================
  // VISTA DE ÉXITO Y GENERACIÓN DE BOLETA
  // ==========================================
  if (pagoExitoso && boletoGenerado) {
    return (
      <>
        {/* ESCUDO DE IMPRESIÓN: Garantiza que SIEMPRE se imprima SOLO el ticket, ocultando todo lo demás */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #boleta-ticket, #boleta-ticket * {
                visibility: visible !important;
              }
              #boleta-ticket {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
              }
            }
          `}
        </style>

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 print:bg-white print:py-0 print:min-h-fit">
          
          {/* CONTENEDOR UI DE ÉXITO (Se esconde al imprimir) */}
          <div className="max-w-md w-full text-center space-y-6 print:hidden mb-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-zinc-800">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900/30">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">¡Compra Exitosa!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">El cargo se completó correctamente mediante {boletoGenerado.metodo}.</p>
              
              {/* Botones de Acción */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={descargarBoletoPDF}
                  disabled={descargandoPdf}
                  className={`flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm ${descargandoPdf ? 'bg-gray-400 cursor-wait' : 'bg-[#6a8e23] hover:bg-[#526e1b]'}`}
                >
                  <DownloadIcon fontSize="small" /> {descargandoPdf ? 'Generando PDF...' : 'Descargar Boleta'}
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  disabled={descargandoPdf}
                  className={`flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700 ${descargandoPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Ir al Dashboard <ArrowForwardIcon fontSize="small" />
                </button>
              </div>
              
              {errorMensaje && (
                <div className="mt-4 text-xs font-bold text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                  {errorMensaje}
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* CONTENEDOR EXACTO DE LA BOLETA (Capturado por PDF) */}
          {/* NOTA: Eliminadas las clases border-dashed para evitar congelamiento */}
          {/* ========================================== */}
          <div className="max-w-[700px] mx-auto w-full print:max-w-full print:m-0 print:p-0">
            <div 
              id="boleta-ticket" 
              className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 text-left overflow-hidden font-sans print:shadow-none print:border-none print:rounded-none print:p-0"
            >
              {/* Encabezado */}
              <div className="border-b-2 border-solid border-gray-200 pb-4 text-center">
                <h1 className="text-xl font-black tracking-wider text-gray-900">TEGRIDAD TRANSPORTES</h1>
                <p className="text-[10px] text-gray-500 uppercase font-semibold mt-0.5">R.U.C. 20123456789 | Boleta de Venta Electrónica</p>
                <div className="mt-3 bg-gray-50 py-1.5 px-3 rounded-md inline-block border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Código de Ticket:</span>
                  <strong className="text-sm text-gray-900 ml-1 tracking-wide">{boletoGenerado.idCompra}</strong>
                </div>
              </div>

              {/* Detalles Transacción */}
              <div className="py-4 space-y-2 border-b border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between"><span>Fecha de Emisión:</span><strong className="text-gray-800">{boletoGenerado.fechaCompra}</strong></div>
                <div className="flex justify-between"><span>Pasajero:</span><strong className="text-gray-800 uppercase">{boletoGenerado.pasajero}</strong></div>
                <div className="flex justify-between"><span>Método de Pago:</span><strong className="text-gray-800 uppercase">{boletoGenerado.metodo} (Culqi)</strong></div>
              </div>

              {/* Detalles del Viaje */}
              <div className="py-4 space-y-3 border-b border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Información de Ruta</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Origen</p>
                    <p className="text-sm font-bold text-gray-800">{boletoGenerado.origen}</p>
                  </div>
                  <div className="text-gray-400 font-bold text-sm">--&gt;</div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-medium">Destino</p>
                    <p className="text-sm font-bold text-gray-800">{boletoGenerado.destino}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-gray-400 block font-medium">Fecha y Salida:</span>
                    <strong className="text-gray-800">{boletoGenerado.fecha} - {boletoGenerado.hora}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Servicio:</span>
                    <strong className="text-gray-800">{boletoGenerado.servicio}</strong>
                  </div>
                </div>
              </div>

              {/* Asientos */}
              <div className="py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Asientos Reservados:</span>
                  <div className="flex gap-1.5 mt-1">
                    {boletoGenerado.asientos.map(asiento => (
                      <span key={asiento} className="bg-gray-900 text-white font-bold text-xs px-2.5 py-1 rounded-md">
                        #{asiento}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                    ✔ Confirmado
                  </span>
                </div>
              </div>

              {/* Desglose de Precios */}
              <div className="pt-4 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Precio Base ({boletoGenerado.asientos.length} Asiento(s)):</span>
                  <span>S/ {(boletoGenerado.precioUnitario * boletoGenerado.asientos.length).toFixed(2)}</span>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Cupón Aplicado ({cupon}):</span>
                    <span>- S/ {descuentoAplicado.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-2 text-gray-900 border-t border-solid border-gray-100">
                  <strong className="text-sm font-bold">Importe Total Pagado:</strong>
                  <strong className="text-xl font-black text-[#ea580c]">S/ {boletoGenerado.total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Pie de Boleta */}
              <div className="mt-6 pt-4 border-t-2 border-solid border-gray-200 text-center space-y-2">
                <div className="w-full h-10 bg-gray-100 rounded flex items-center justify-center tracking-[0.4em] text-gray-400 text-xs select-none font-mono">
                  ||||| | |||| || ||||| |||| | ||
                </div>
                <p className="text-[9px] text-gray-400">Representación impresa de la Boleta de Venta Electrónica. Gracias por viajar con nosotros.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // INTERFAZ INICIAL (FORMULARIO DE PAGO)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* FORMULARIO CULQI */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200/60 p-8 dark:bg-zinc-900 dark:border-zinc-800/50">
          <div className="mb-6">
            <Link to="/reserva" className="text-sm font-bold text-gray-400 hover:text-primary">← Volver a la reserva</Link>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mt-4 flex justify-between items-center">
              Método de Pago
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full dark:bg-zinc-800">Seguro por Culqi</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <button type="button" onClick={() => setMetodoPago('tarjeta')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${metodoPago === 'tarjeta' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700'}`}>
              <CreditCardIcon fontSize="large" />
              <span className="text-xs font-bold mt-2">Tarjeta</span>
            </button>
            <button type="button" onClick={() => setMetodoPago('yape')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${metodoPago === 'yape' ? 'border-[#740854] bg-[#740854]/5 text-[#740854]' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700'}`}>
              <QrCode2Icon fontSize="large" />
              <span className="text-xs font-bold mt-2">Yape</span>
            </button>
            <button type="button" onClick={() => setMetodoPago('plin')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${metodoPago === 'plin' ? 'border-[#00E5FF] bg-[#00E5FF]/5 text-[#00A1B3]' : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700'}`}>
              <PhoneAndroidIcon fontSize="large" />
              <span className="text-xs font-bold mt-2">Plin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {metodoPago === 'tarjeta' ? (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Número de Tarjeta</label>
                  <input type="text" maxLength="19" placeholder="0000 0000 0000 0000" required className="w-full rounded-xl bg-gray-50 border border-gray-300 px-4 py-3 text-gray-700 focus:ring-primary focus:border-primary outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vencimiento</label>
                    <input type="text" placeholder="MM/AA" maxLength="5" required className="w-full rounded-xl bg-gray-50 border border-gray-300 px-4 py-3 text-gray-700 focus:ring-primary focus:border-primary outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                    <input type="password" placeholder="***" maxLength="4" required className="w-full rounded-xl bg-gray-50 border border-gray-300 px-4 py-3 text-gray-700 focus:ring-primary focus:border-primary outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center animate-fade-in p-6 border-2 border-dashed border-gray-300 rounded-2xl dark:border-zinc-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Escanea para pagar con {metodoPago === 'yape' ? 'Yape' : 'Plin'}</h3>
                <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl shadow-sm mb-4">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PagoTegridad${precioFinal}`} alt="QR de Pago" className="w-full h-full" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total a pagar: <strong className="text-gray-900 dark:text-white">S/ {precioFinal.toFixed(2)}</strong></p>
              </div>
            )}

            <button type="submit" disabled={procesando} className={`w-full mt-8 rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2 ${procesando ? 'bg-gray-400 cursor-not-allowed' : metodoPago === 'yape' ? 'bg-[#740854] hover:bg-[#5a0641]' : metodoPago === 'plin' ? 'bg-[#00A1B3] hover:bg-[#00818f]' : 'bg-[#f06522] hover:bg-[#d9551c]'}`}>
              {procesando ? 'Procesando pago con Culqi...' : metodoPago === 'tarjeta' ? `Pagar S/ ${precioFinal.toFixed(2)}` : 'Confirmar Pago QR'}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-96 bg-white rounded-3xl shadow-sm border border-gray-200/60 p-8 dark:bg-zinc-900 dark:border-zinc-800/50 h-fit">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Resumen de Compra</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-gray-500 dark:text-gray-400">Ruta</span>
              <span className="font-bold text-gray-800 dark:text-white text-right">{reserva.origen} ➔ {reserva.destino}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-gray-500 dark:text-gray-400">Asientos ({reserva.asientos.length})</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {reserva.asientos.map(asiento => (
                  <span key={asiento} className="font-bold text-white bg-[#6a8e23] px-2 py-1 rounded-md text-xs">
                    #{asiento}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-bold text-gray-800 dark:text-white">S/ {reserva.total.toFixed(2)}</span>
            </div>

            {descuentoAplicado > 0 && (
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800 text-green-600 font-bold">
                <span>Cupón ({cupon})</span>
                <span>- S/ {descuentoAplicado.toFixed(2)}</span>
              </div>
            )}
            
            <div className="pt-4 flex justify-between items-end">
              <span className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">Total a pagar</span>
              <span className="text-3xl font-black text-[#ea580c]">S/ {precioFinal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}