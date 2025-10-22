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
        <input type="number" id="duracion" v-model.number="entrenamiento.duracion" min="1" required />
      </div>

      <div class="form-group">
        <label for="distancia">Distancia (km):</label>
        <input type="number" id="distancia" v-model.number="entrenamiento.distancia" step="0.01" min="0" required />
      </div>
      <!-- 🟩 Botones -->
      <div class="button-group">
        <button type="submit">
          {{ entrenamientoEditar ? "Actualizar" : "Guardar" }}
        </button>

        <!-- Solo se muestra cuando se está editando -->
        <button v-if="entrenamientoEditar" type="button" class="cancel-btn" @click="cancelar">
          Cancelar

        </button>
        <!-- 🗑️ Botón para eliminar cuando se está editando -->

      </div>
    </form>
    <!-- Mostrar los datos en tiempo real -->
    <div class="resultado">
      <h3>Vista previa del entrenamiento:</h3>
      <p><strong>Fecha:</strong> {{ entrenamiento.fecha || "—" }}</p>
      <p><strong>Duración:</strong> {{ entrenamiento.duracion || "—" }} min</p>
      <p><strong>Distancia:</strong> {{ entrenamiento.distancia || "—" }} km</p>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { ref, onMounted } from 'vue'

const coleccion = collection(db, 'entrenamientos')

async function obtenerEntrenamientos() {
  try {
    const snapshot = await getDocs(coleccion)
    const entrenamientos = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }))
    console.log('📄 Entrenamientos obtenidos:', entrenamientos)
    return entrenamientos
  } catch (e) {
    console.error('❌ Error al obtener entrenamientos:', e)
    return []
  }
}

export default {

  props: {
    entrenamientoEditar: Object,
  },
  watch: {
    // Si recibimos datos para editar, los cargamos en el formulario
    entrenamientoEditar: {
      handler(nuevoValor) {
        if (nuevoValor) {
          this.entrenamiento = { ...nuevoValor };
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      entrenamiento: {
        id: "",
        fecha: "",
        duracion: "",
        distancia: "",
      },
    };
  },
  methods: {
    async guardar() {

      try {
        const docRefid = (await addDoc(coleccion, { ...this.entrenamiento })).id
        this.entrenamiento.id = docRefid;
        this.$emit("guardar-entrenamiento", { ...this.entrenamiento });
        this.resetForm();
        console.log('✅ Entrenamiento guardado con ID:', docRefid)
        return docRefid
      } catch (e) {
        alert(e)
        console.error('❌ Error al guardar entrenamiento:', e)
      }
    },
    async editar() {
      console.log(this.entrenamiento.id)
      try {
        const ref = doc(db, 'entrenamientos', this.entrenamiento.id)
        this.$emit("editar-entrenamiento", { ...this.entrenamiento });
        await updateDoc(ref, { ...this.entrenamiento })
        console.log('✏️ Entrenamiento actualizado correctamente')
        this.resetForm();
      } catch (e) {
        alert(e)
        console.error('❌ Error al editar entrenamiento:', e)
      }
    },
    cancelar() {
      this.resetForm();
      this.$emit("cancelar-edicion");
    },
    resetForm() {
      this.entrenamiento = { fecha: "", duracion: "", distancia: "" };
    },
  },
  setup() {
    onMounted(async () => {
      //await obtenerEntrenamientos()
    })
  }
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
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

button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cancel-btn {
  background-color: #ccc;
  color: #000;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #aaa;
}
</style>
