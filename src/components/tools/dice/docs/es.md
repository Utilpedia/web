## Cómo Funciona

El lanzador de dados simula el lanzamiento de dados físicos utilizando el generador de números aleatorios de tu dispositivo. Cada tirada es completamente independiente—los resultados anteriores no tienen influencia en las tiradas futuras, igual que los dados reales.

### Uso de la Herramienta

1. **Número de Caras**: Elige cuántas caras tienen tus dados (2–1000). Las opciones comunes incluyen d6 (dados estándar), d20 (RPGs de mesa) y d100 (porcentual).

2. **Número de Dados**: Selecciona cuántos dados lanzar a la vez (1–100).

3. **Modo de Visualización**: Alterna entre ver la suma total o los resultados individuales de cada tirada.

## Las Matemáticas Detrás

Cada tirada de dado es un evento independiente con probabilidad uniforme. Para un dado con _n_ caras:

- Probabilidad de cualquier resultado: **1/n**
- Valor esperado (promedio) de un dado: **(n + 1) / 2**
- Para múltiples dados, el total sigue una distribución de probabilidad centrada en **dados × (n + 1) / 2**

### Ejemplo: Lanzando 2d6

Al lanzar dos dados de seis caras, el mínimo es 2 y el máximo es 12. Sin embargo, 7 es el resultado más común porque hay más formas de obtener 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) que cualquier otro número.

## Tipos de Dados Comunes

| Notación | Caras | Usos Comunes                   |
| -------- | ----- | ------------------------------ |
| d4       | 4     | Daño en D&D                    |
| d6       | 6     | Juegos de mesa, Yahtzee        |
| d8       | 8     | Daño de armas                  |
| d10      | 10    | Tiradas porcentuales           |
| d12      | 12    | Daño de bárbaro                |
| d20      | 20    | Ataques y pruebas de habilidad |
| d100     | 100   | Tablas de golpe crítico        |

## Generación de Números Aleatorios

Esta herramienta usa `Math.random()`, que proporciona un generador de números pseudoaleatorios (PRNG). Aunque no es criptográficamente seguro, es perfectamente adecuado para lanzar dados y juegos. Para aplicaciones que requieren aleatoriedad verdadera (como criptografía), se deben usar hardware especializado o servicios como [random.org](https://random.org).
