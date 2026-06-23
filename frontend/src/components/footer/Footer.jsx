export default function Footer() {
  return (
    <footer className="w-full transition-colors duration-300">
      <div className="bg-primary text-white text-center py-8 border-t-8 border-accent">
        <h3 className="text-xl font-bold tracking-wide">TEGRIDAD S.A.C.</h3>
        <p className="mt-2 text-sm text-gray-200">Servicio Terrestre Premium Cusco — Lima</p>
        <p className="mt-1 text-xs font-semibold">Central de Atención: (01) 999 888 777</p>
      </div>
      <div className="bg-neutral-950 text-neutral-500 text-center py-4 text-xs dark:bg-black dark:text-neutral-600">
        <p>&copy; {new Date().getFullYear()} Tegridad Transportes. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}