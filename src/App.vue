<template>
  <div class="app-container">
    <!-- Izquierda: Formulario -->
    <div class="form-section">
      <EntrenamientoForm :entrenamientoEditar="entrenamientoSeleccionado" @guardar-entrenamiento="agregarEntrenamiento"
        @editar-entrenamiento="EditarEntrenamiento" @cancelar-edicion="cancelarEdicion" />
    </div>

    <!-- Derecha: Lista de entrenamientos -->
    <div class="container-entrenamiento">
      <div>
        <h2> Lista de Entrenamientos</h2>
      </div>
      <div class="list-section">
        <div v-if="entrenamientos.length === 0">No hay entrenamientos registrados.</div>
        <div v-for="(item, index) in entrenamientos" :key="index" class="card">
          <p><strong>Fecha:</strong> {{ item.fecha }}</p>
          <p><strong>Duración:</strong> {{ item.duracion }} min</p>
          <p><strong>Distancia:</strong> {{ item.distancia }} km</p>

          <!--  Agrupamos los botones -->
          <div class="acciones">
            <button class="editar-btn" @click="seleccionarEntrenamiento(item, index)">✏️ Editar</button>
            <button class="eliminar-btn" @click="eliminarEntrenamiento(item, index)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import EntrenamientoForm from "./components/EntrenamientoForm.vue"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from './firebase'
//Referencias y estado reactivo ------ para renderizar la lista y para saber qué entrenamiento está en modo edición.
const coleccion = collection(db, 'entrenamientos')
const entrenamientos = ref([])
const entrenamientoSeleccionado = ref(null)
// ----------------------
// Real-time: onSnapshot con orden por fecha
// ----------------------
let unsubscribe = null

//Ciclo de vida de la app
//onMounted se ejecuta cuando se inicia o actualiza la pagina onMounted — establecer escucha en tiempo real
onMounted(() => {
  // Ajusta 'desc' la fecha
  // order by == ordernar por
  //query == busqueda

  const q = query(coleccion, orderBy('fecha', 'desc'))
  //unsubscribe == programacion reactiva (reaciona a eventos)
  unsubscribe = onSnapshot(q, (snapshot) => { //Evento activa con q 
    entrenamientos.value = snapshot.docs.map(d => ({
      ...d.data(),
      id: d.id
    }))
    console.log('🔁 Snapshot recibido - entrenamientos actualizados:', entrenamientos.value)
  }, (error) => {
    console.error('❌ Error en onSnapshot:', error)
  })
})
//onUnmounted se ejecuta cuando desaparece (se cierra) la pagina//cuando el componente se desmonta -limpiar la suscripcion
onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe()
})
// ----------------------
// Acciones que llaman desde componentes
// ----------------------
//Funciones de referencia para saber que todo este ok ---responden a eventos del formulario

function agregarEntrenamiento(nuevoEntrenamiento) {
  console.log('↗️ Se solicitó agregar (la lista real la actualiza Firestore via onSnapshot):', nuevoEntrenamiento)
}

function seleccionarEntrenamiento(entrenamiento, index) {
  entrenamientoSeleccionado.value = { ...entrenamiento, index }
}
function EditarEntrenamiento(entrenamientoEditado) {
  console.log('✏️ Editado (la lista la actualiza Firestore via onSnapshot):', entrenamientoEditado)
  entrenamientoSeleccionado.value = null
}

// Cancelar edición
function cancelarEdicion() {
  entrenamientoSeleccionado.value = null;
}

// Eliminar entrenamiento
const eliminarEntrenamiento = async (item, index) => {
  const confirmar = confirm(`¿Seguro que quieres eliminar el entrenamiento del ${item.fecha}?`);
  if (!confirmar) return;
  //realiza la acción destructiva (borrar) directamente en Firestore. Al borrar el documento, 
  // la suscripción onSnapshot notará el cambio y actualizará entrenamientos.value
  try {
    const refDoc = doc(db, "entrenamientos", item.id);
    await deleteDoc(refDoc);
    alert("✅ Entrenamiento eliminado correctamente");
    console.log(`🗑️ Entrenamiento eliminado con ID: ${item.id}`);
  } catch (error) {
    console.error("❌ Error al eliminar entrenamiento:", error);
    alert("Ocurrió un error al eliminar el entrenamiento.");
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
  gap: 40px;
  background-color: #8ecae6;
  /* color de fondo */
  min-height: 100vh;
}


/* Columna izquierda (Formulario) más grande */
.form-section {
  flex: 1, 2;
  /* aumentamos el ancho del formulario */
  display: flex;
  justify-content: center;
}

.form-container {
  max-width: 600px;
  /* antes era 400px */
  background: #f8f6f6;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

/* Columna derecha (lista de tarjetas) */
.list-section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 70vw;
  padding: 20px;
  border-radius: 10px;
  max-height: 90vh;
  overflow-y: auto;

}

.container-entrenamiento {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(5, 5, 5, 0.1);
  background: linear-gradient(135deg, #d1f0ff, #a8e0ff);
  /*fondo notorio */
}



/* Estilo de tarjetas */
.card {
  border: 1px solid #a6d8e8;
  border-radius: 12px;
  padding: 15px;
  width: 250px;
  /* ancho fijo para que sean visibles lado a lado */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.3s;
  flex-shrink: 0;
  /* evita que se reduzcan */
  margin: 5px;
}

/* Alternar colores */
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

.acciones {
  display: flex;
  justify-content: flex-start;
  /* alineación a la izquierda */
  gap: 15px;
  /* espacio entre botones */
}

.acciones button {
  flex: none;
  /* sin aumento automáticamente */
  width: 100px;
  /* ancho fijo */
  padding: 6px 12px;
  /* altura más reducida */
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
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


.acciones button:first-child {
  background-color: #27d17c;
}

.acciones button:last-child {
  background-color: #e24e4b;
}

.acciones button:hover {
  opacity: 0.85;
}
</style>
