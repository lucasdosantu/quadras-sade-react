const modulosBairros = import.meta.glob("./bairros/*.js", { eager: true });

export const baseDeDados = Object.values(modulosBairros).flatMap(
  (modulo) => modulo.default || [],
);
