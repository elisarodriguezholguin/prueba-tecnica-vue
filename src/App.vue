<template>
  <div class="app-container">
    <!-- Izquierda: Formulario -->
    <div class="form-section">
      <EntrenamientoForm
        :entrenamientoEditar="entrenamientoSeleccionado"
        @guardar-entrenamiento="agregarEntrenamiento"
        @editar-entrenamiento="EditarEntrenamiento"
        @cancelar-edicion="cancelarEdicion"
      />
    </div>
  

    <!-- Derecha: Lista de entrenamientos -->
    <div class="list-section">
      <h2>Lista de Entrenamientos</h2>
      <div v-for="(item, index) in entrenamientos" :key="index" class="card">
        <p><strong>Fecha:</strong> {{ item.fecha }}</p>
        <p><strong>Duración:</strong> {{ item.duracion }} min</p>
        <p><strong>Distancia:</strong> {{ item.distancia }} km</p>
        <button @click="seleccionarEntrenamiento(item, index)">Editar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EntrenamientoForm from "./components/EntrenamientoForm.vue"

const entrenamientos = ref([])
const entrenamientoSeleccionado = ref(null)

// Agregar nuevo
function agregarEntrenamiento(nuevoEntrenamiento) {
  entrenamientos.value.push(nuevoEntrenamiento)
}

// Seleccionar para editar
function seleccionarEntrenamiento(entrenamiento, index) {
  entrenamientoSeleccionado.value = { ...entrenamiento, index }
}

// Editar existente
function EditarEntrenamiento(entrenamientoEditado) {
  const i = entrenamientoEditado.index
  if (i !== undefined && i !== null) {
    entrenamientos.value[i] = {
      fecha: entrenamientoEditado.fecha,
      duracion: entrenamientoEditado.duracion,
      distancia: entrenamientoEditado.distancia
    }
  }
  entrenamientoSeleccionado.value = null
}
// Cancelar edición
function cancelarEdicion() {
  entrenamientoSeleccionado.value = null;
}
</script>
<style scoped>

.app-container {
 display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
  gap: 40px;
}

/* Columna izquierda (formulario) */
.form-section {
  flex: 1;
  display: flex;
  justify-content: center;
}


/* Columna derecha (lista de tarjetas) */
.list-section {
  flex: 1;
  background-color: #fdfafa;
  padding: 20px;
  border-radius: 10px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(5, 5, 5, 0.1);
}

.list-section h2 {
  margin-bottom: 1rem;
  color: #333;
}
.card {
  border: 1px solid #a6d8e8;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.3s;
}

/* Alternar colores: azul suave / verde suave */
.card:nth-child(odd) {
  background: linear-gradient(135deg, #c3e8f5, #e6f8ff);
}

.card:nth-child(even) {
  background: linear-gradient(135deg, #c7f3d4, #e9fff0);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.card strong {
  color: #0b3954;
}

button {
  background-color: #5ab1c8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.3s;
}

button:hover {
  background-color: #3b93ab;
}

</style>
