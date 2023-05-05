class Presupuesto {
    constructor(presupuesto) {
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
      this.gastos = [];
    }
  
    nuevoGasto(gasto) {
      this.gastos = [...this.gastos, gasto];
      this.calcularRestante();
    }
  
    calcularRestante() {
      const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
      this.restante = this.presupuesto - gastado;
    }
  
    eliminarGasto(id) {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      this.calcularRestante();
    }
  }



  class UI {
    constructor() {
      this.formulario = document.querySelector('#agregar-gasto');
      this.gastoNombre = document.querySelector('#gasto');
      this.gastoCantidad = document.querySelector('#cantidad');
      this.gastoListado= document.querySelector('#gastos ul');
      this.restanteTotal = document.querySelector('#restante');
      this.presupuesto = null;
  
      this.iniciarApp();
    }
  
    iniciarApp() {
      this.obtenerPresupuesto();
      this.formulario.addEventListener('submit', e => {
        e.preventDefault();
        this.agregarGasto();
      });
    }
  
    obtenerPresupuesto() {
      let presupuestoUsuario = prompt('¿Cuál es tu presupuesto semanal?');
  
      while (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || Number(presupuestoUsuario) <= 0) {
        presupuestoUsuario = prompt('Presupuesto no válido. Por favor ingrese un presupuesto válido.');
      }
  
      this.presupuesto = new Presupuesto(presupuestoUsuario);
      this.actualizarRestante(this.presupuesto.restante);
    }
  
    agregarGasto() {
      const nombre = this.gastoNombre.value;
      const cantidad = Number(this.gastoCantidad.value);
  
      if (nombre === '' || cantidad === '') {
        this.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
      } else if (cantidad <= 0 || isNaN(cantidad)) {
        this.imprimirAlerta('Cantidad no válida', 'error');
        return;
      }
  
      const gasto = { nombre, cantidad, id: Date.now() };
      this.presupuesto.nuevoGasto(gasto);
      this.imprimirAlerta('Gasto agregado correctamente');
  
      this.mostrarGastos(this.presupuesto.gastos);
      this.actualizarRestante(this.presupuesto.restante);
  
      this.formulario.reset();
    }
  
    imprimirAlerta(mensaje, tipo) {
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert');
  
      if (tipo === 'error') {
        divMensaje.classList.add('alert-danger');
      } else {
        divMensaje.classList.add('alert-success');
      }
  
      divMensaje.textContent = mensaje;
  
      document.querySelector('.primario').insertBefore(divMensaje, this.formulario);
  
      setTimeout(() => {
        divMensaje.remove();
      }, 3000);
    }
  
    mostrarGastos(gastos) {
        if (!this.gastoListado) return; 
        this.gastoListado.innerHTML = '';
        gastos.forEach(gasto => {
        const { nombre, cantidad, id } = gasto;
  
        const nuevoGasto = document.createElement('li');
        nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
        nuevoGasto.dataset.id = id;
  
        nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
        `;
  
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.onclick = () => {
          this.eliminarGasto(id);
        };
        nuevoGasto.appendChild(btnBorrar);
  
        this.gastoListado.appendChild(nuevoGasto);
      });
  
    }
  
    actualizarRestante(restante) {
      this.restanteTotal.textContent = restante;
    }
    eliminarGasto(id) {
        this.presupuesto.eliminarGasto(id);
        this.mostrarGastos(this.presupuesto.gastos);
        this.actualizarRestante(this.presupuesto.restante);
        this.presupuesto.gastos = this.presupuesto.gastos.filter(gasto => gasto.id !== id);
        this.calcularPresupuesto();
    }  
}

const ui = new UI();