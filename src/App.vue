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

          <!-- 🔽 Agrupamos los botones -->
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

const coleccion = collection(db, 'entrenamientos')
const entrenamientos = ref([])
const entrenamientoSeleccionado = ref(null)
// ----------------------
// Real-time: onSnapshot con orden por fecha
// ----------------------
let unsubscribe = null

onMounted(() => {
  // Ajusta 'desc' o 'asc' según necesites
  const q = query(coleccion, orderBy('fecha', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    entrenamientos.value = snapshot.docs.map(d => ({
      ...d.data(),
      id: d.id
    }))
    console.log('🔁 Snapshot recibido - entrenamientos actualizados:', entrenamientos.value)
  }, (error) => {
    console.error('❌ Error en onSnapshot:', error)
  })
})
onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe()
})
// ----------------------
// Acciones que llaman desde componentes
// ----------------------

// NOTA: Con onSnapshot, no es necesario "push" manual al agregar o
// editar — la UI se actualizará cuando Firebase confirme el cambio.
// Se puede seguir emitiendo eventos desde EntrenamientoForm que creen/editen
// en Firestore (addDoc/updateDoc) y el snapshot hará lo demás.

function agregarEntrenamiento(nuevoEntrenamiento) {
  // Opcional: si quieres mantener compatibilidad imediata en UI, podrías:
  // entrenamientos.value.unshift(nuevoEntrenamiento) // pero el snapshot será la fuente de la verdad
  // Recomiendo NO hacer push manual si confías en onSnapshot.
  console.log('↗️ Se solicitó agregar (la lista real la actualiza Firestore via onSnapshot):', nuevoEntrenamiento)
}

function seleccionarEntrenamiento(entrenamiento, index) {
  entrenamientoSeleccionado.value = { ...entrenamiento, index }
}
function EditarEntrenamiento(entrenamientoEditado) {
  // Si estás enviando updateDoc a Firestore desde el form,
  // el snapshot actualizará la lista automáticamente.
  console.log('✏️ Editado (la lista la actualiza Firestore via onSnapshot):', entrenamientoEditado)
  entrenamientoSeleccionado.value = null
}



// Cancelar edición
function cancelarEdicion() {
  entrenamientoSeleccionado.value = null;
}

// 🗑️ Eliminar entrenamiento
const eliminarEntrenamiento = async (item, index) => {
  const confirmar = confirm(`¿Seguro que quieres eliminar el entrenamiento del ${item.fecha}?`);
  if (!confirmar) return;

  try {
    const refDoc = doc(db, "entrenamientos", item.id);
    await deleteDoc(refDoc);
    //entrenamientos.value.splice(index, 1); // 🔁 Eliminar también de la lista 
    // No es necesario splicear localmente: onSnapshot actualizará la lista.
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


/* 📏 Columna izquierda (Formulario) más grande */
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
  /* 💙 fondo más notorio */
}



/* 🧩 Estilo de las tarjetas */
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
  /* ya no crecen automáticamente */
  width: 100px;
  /* ancho fijo */
  padding: 6px 12px;
  /* altura más reducida */
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}



/* Pequeño efecto al pasar el mouse */

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
  /* verde para editar */
}

.acciones button:last-child {
  background-color: #e24e4b;
  /* rojo para eliminar */
}

.acciones button:hover {
  opacity: 0.85;
}
</style>
