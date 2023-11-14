import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from 'src/app/interfaces/Estudiante';
import { Opciones } from 'src/app/interfaces/Opciones';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements AfterViewInit {
  form: FormGroup;
  listaEstudiante: Estudiante[] = [];


  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'Asistencia', 'nota1', 'nota2', 'promedio', 'condicion','estadoAsistencia', 'acciones'];
  dataSource = new MatTableDataSource<Estudiante>();
  #loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = 'Items por pag';
    }
  }

  agregarEstudiante(): void {
    const estudiante: Estudiante = {
      cedula: this.form.value.cedula,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      Asistencia: parseInt(this.form.value.Asistencia),
      nota1: Number(this.form.value.nota1), 
      nota2: Number(this.form.value.nota2), 
    };
    if (isNaN(estudiante.nota1) || isNaN(estudiante.nota2)) {
      // Asegurar que ingrese numeros el usuario
      console.error('Deben digitar numeros correctos');
      return;
    }
  estudiante.promedio = (estudiante.nota1 + estudiante.nota2) / 2;

  
  if (estudiante.Asistencia >= 50) {
    if (estudiante.promedio !== undefined && estudiante.promedio >= 7) {
      estudiante.condicion = 'Aprobado';
      estudiante.estadoAsistencia = 'Asistencia cumplida';
    } else {
      estudiante.condicion = 'Reprobado por promedio';
      estudiante.estadoAsistencia = 'Asistencia cumplida';
    }
  } else {
    estudiante.condicion = 'Reprobado por asistencia';
    estudiante.estadoAsistencia = 'Asistencia no cumplida';
  }


    this.listaEstudiante.push(estudiante);
    this.dataSource.data = this.listaEstudiante;

    this.mensajeExito('registrado');
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`El alumno fue ${texto} con exito`, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  eliminarEstudiante(cedula: string): void {
    const indice = this.listaEstudiante.findIndex(element => element.cedula == cedula)
    console.log(indice);
    this.listaEstudiante.splice(indice, 1);
    this.dataSource.data = this.listaEstudiante;
  }

  mostrar(element: Estudiante): void {
    console.log(element.nombre);
    console.log(JSON.stringify(element));
    this.router.navigate(['mostrar', JSON.stringify(element)]);
  }

  cancelar(): void {
    this.form.reset();
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private aRoute: ActivatedRoute) {

    this.form = this.fb.group({
      cedula: ['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^([0-9])*$/)
        ]
      ],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      Asistencia: [''], // Nuevo 
      nota1: [''], // Nuevo 
      nota2: [''], // Nuevo 
    })
  }
}
