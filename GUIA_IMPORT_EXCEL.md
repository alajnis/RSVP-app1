# Guía de Importación de Invitados (Excel)

Para importar invitados masivamente, crea un archivo Excel (.xlsx) con las siguientes columnas (el orden es importante):

| Columna | Nombre | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| **A** | **Apellido** | Apellido de la familia o invitado principal | Pérez |
| **B** | **Nombre** | Nombre del invitado principal | Juan |
| **C** | **Cantidad** | Número total de personas en la invitación (incluyéndolo) | 2 |
| **D** | Email | (Opcional) Email de contacto | juan@mail.com |
| **E** | Teléfono | (Opcional) Teléfono de contacto | 1155556666 |
| **F** | Dieta | (Opcional) Restricción alimentaria del principal | Vegano |
| **G** | Edad | (Opcional) Categoría de edad (Adulto/Teen/Niño/Bebé) | Adulto |

### Notas:
1. **Sin encabezados**: La primera fila se ignora si tiene títulos como "Apellido", "Nombre", etc. Es mejor empezar directo con los datos en la fila 2, o poner encabezados en la fila 1 (el sistema los detectará como invitados inválidos y los saltará, así que no hay problema).
2. **Sub-invitados**: Si pones "Cantidad: 3", el sistema creará al invitado principal ("Juan Pérez") y 2 acompañantes vacíos ("Por completar") para que luego completes sus nombres.
3. **Edad**: Si la columna G está vacía, se asume "Adulto" para el principal.

### Ejemplo Visual

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Pérez | Juan | 2 | juan@test.com | | Vegano | Adulto |
| Gomez | María | 1 | maria@test.com | | Celiaco | Teen |
| Lopez | Carlos | 4 | | | | Adulto |
