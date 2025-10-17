<template>
  <div class="form-container">
    <h2>{{ entrenamientoEditar ? "Editar Entrenamiento" : "Registrar Entrenamiento" }}</h2>

       <form @submit.prevent="entrenamientoEditar ? editar() : guardar()">
      <div class="form-group">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="entrenamiento.fecha" required />
      </div>

      <div class="form-group">
        <label for="duracion">Duración (minutos):</label>
        <input type="number" id="duracion" v-model.number="entrenamiento.duracion" min="1" required/>
      </div>

      <div class="form-group">
        <label for="distancia">Distancia (km):</label>
        <input type="number" id="distancia"v-model.number="entrenamiento.distancia" step="0.01"min="0"required/>
      </div>
      <button type="submit">{{ entrenamientoEditar ? "Actualizar" : "Guardar" }}</button>
    </form>

    <!-- 👇 Mostrar los datos en tiempo real -->
    <div class="resultado">
      <h3>Vista previa del entrenamiento:</h3>
      <p><strong>Fecha:</strong> {{ entrenamiento.fecha || "—" }}</p>
      <p><strong>Duración:</strong> {{ entrenamiento.duracion || "—" }} min</p>
      <p><strong>Distancia:</strong> {{ entrenamiento.distancia || "—" }} km</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"; // Importamos ref y watch
// Declarar el evento que se emitirá al guardar
const emit = defineEmits(["guardar-entrenamiento", "editar-entrenamiento"]);
const props = defineProps({
  entrenamientoEditar: Object,
});
// Estado reactivo del formulario
const entrenamiento = ref({ fecha: "", duracion: null, distancia: null, id: null });

// Si llega un entrenamiento para editar, lo carga en el formulario
watch(
  () => props.entrenamientoEditar,
  (nuevo) => {
    if (nuevo) entrenamiento.value = { ...nuevo };
  },
  { immediate: true }
);

function guardar() {
  emit("guardar-entrenamiento", { ...entrenamiento.value });
  limpiar();
}


function editar() {
  console.log(entrenamiento.value)
  emit("editar-entrenamiento", { ...entrenamiento.value });
  limpiar();

}

function limpiar() {
  entrenamiento.value = { fecha: "", duracion: null, distancia: null };
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 30px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f6f6;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #444;
}

input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
}

button:hover {
  background-color: #2c8f6b;
}

.resultado {
  margin-top: 20px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
}

.resultado h3 {
  margin-bottom: 10px;
  color: #2e7d32;
}
</style>
