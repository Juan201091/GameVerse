import mysql.connector
import datetime

class Mensaje:
    def __init__(self):
        self.host ="localhost" #"JayP201091.mysql.pythonanywhere-services.com"
        self.user ="root" #"JayP201091"
        self.password =""  #"JCE201122!"
        self.database = "clientes" #"JayP201091$mensajes"
        self.conexion = None 
        self.cursor = None
    
    def abrir_conexion(self):
        try:
            self.conexion = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            self.cursor = self.conexion.cursor(dictionary=True)
            print("Se abrio la conexion correctamente")
        except mysql.connector.Error as error:
            if error.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
            # La base de datos no existe, intenta crearla
                try:
                    self.crear_base_datos()
                except mysql.connector.Error as err:
                    print(f"Error al crear la base de datos: {err}")
            else:
                print(f"Ocurrio un error al abrir la base de datos{error}")
 
    def cerrar_conexion(self):
        if (self.conexion.is_connected()):
            self.cursor.close()
            self.conexion.close()
            print("Conexion cerrada")
            
    def crear_base_datos(self):
        try:
            self.conexion = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
            )
            self.cursor = self.conexion.cursor()
            self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
            self.cursor.execute(f"USE {self.database}")
            self.cursor.execute('''CREATE TABLE IF NOT EXISTS mensajes (
            IdMensajes int(11) NOT NULL AUTO_INCREMENT,
            Nombre varchar(30) NOT NULL,
            Apellido varchar(30) NOT NULL,
            Email varchar(60) NOT NULL,
            Mensaje varchar(500) NOT NULL,
            Fecha_envio datetime NOT NULL,
            Leido tinyint(1) NOT NULL,
            Gestion varchar(500) DEFAULT NULL,
            Fecha_gestion datetime DEFAULT NULL,
            PRIMARY KEY(`IdMensajes`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
            ''')
        # Confirma la transacción en la base de datos.
            self.conexion.commit()
            print("Base de datos creada exitosamente")
        except mysql.connector.Error as error:
            print(f"Error al crear la base de datos: {error}")
        finally:
            self.cerrar_conexion()

    def enviar_mensaje(self,nombre,apellido,email,consulta):
        try:
            self.abrir_conexion()
            sql = "INSERT INTO mensajes (Nombre, Apellido, Email, Mensaje, Fecha_envio) VALUES (%s, %s, %s, %s, %s)"
            fecha_envio = datetime.datetime.now()
            fecha_formateada = fecha_envio.strftime("%Y-%m-%d")
            valores = (nombre, apellido, email, consulta, fecha_formateada)
            self.cursor.execute(sql, valores)
            if(self.cursor.rowcount > 0 ):
                self.conexion.commit()    
                return True
        except mysql.connector.Error as error:
            print(f"Error al enviar el mensaje:{error}")
            return False
        finally:
            self.cerrar_conexion()
        
    def lista_mensajes(self):
        try:
            self.abrir_conexion()
            sql = "SELECT * FROM mensajes "
            self.cursor.execute(sql)
            mensajes = self.cursor.fetchall()  
            if(self.cursor.rowcount > 0 ):
                return mensajes
        except mysql.connector.Error as error:
            print(f"Error al enviar el mensaje:{error}")
            return False
        finally:
            self.cerrar_conexion()
    
    def responder_mensaje(self, id, gestion):
        try:
            self.abrir_conexion()
            fecha_gestion = datetime.datetime.now()
            fecha_formateada = fecha_gestion.strftime("%Y-%m-%d")
            sql = "UPDATE mensajes SET Leido = %s, Gestion = %s, Fecha_gestion = %s WHERE IdMensajes = %s"
            valores = (1,gestion, fecha_formateada, id)
            self.cursor.execute(sql, valores)
            if(self.cursor.rowcount > 0 ):
                self.conexion.commit()
                return True
        except mysql.connector.Error as error:
            print(f"error al enviar el mensaje:{error}")
            return False
        finally:    
            self.cerrar_conexion()
    
    def buscar_mensaje(self,id):
        try:
            self.abrir_conexion()
            sql = f"Select IdMensajes,Nombre,Apellido,Email,Fecha_envio,Mensaje,Leido from mensajes WHERE IdMensajes = {id}"
            self.cursor.execute(sql)
            row = self.cursor.fetchone()
            return row
        except mysql.connector.Error as error:
            print(f"Error en al buscar el mensaje {error}")
            return False
        finally:
            self.cerrar_conexion()    
            
    def eliminar_mensaje(self,id):
        try:
            self.abrir_conexion()
            sql1 = f"Select * FROM mensajes WHERE IdMensajes = {id}"
            sql2 = f"DELETE from mensajes WHERE IdMensajes = {id}"
            self.cursor.execute(sql1)
            fila = self.cursor.fetchall()
            self.cursor.execute(sql2)   
            if(self.cursor.rowcount > 0):
                self.conexion.commit()
                return f"Se borro el siguiente registro:\n {fila}"
        except mysql.connector.Error as error:
            print(f"Error en al buscar el mensaje {error}")
            return False
        finally:
            self.cerrar_conexion()
