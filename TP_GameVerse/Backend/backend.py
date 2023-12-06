import os
from flask import Flask,render_template,jsonify,request
# Permite recibir peticiones de distintos origenes
# a veces tengo un backend que solo el permito recibir peticiones 
# de un dominio especifico y no dde otros
# pero a veces la app web se encuentra en otro domino
from flask_cors import CORS
from mensaje import Mensaje


# permite la conexion del front con el servidor en el back
app = Flask(__name__)

# permite que la applicacion reciba peticiones desde cualquier dominio
CORS(app,resources={r"/*":{"origins":"*"}})

# creo la instancia de mensaje
mensaje = Mensaje()

# eesta ruta especifica mensajes es al aque me voy a conectar desde el front y 
#  el metodo que voy a utilizar
# para recibir el listado json que voy a mostrar de la base

@app.route("/mensajes", methods=["GET"])
def listar_mensajes():
    respuesta = mensaje.lista_mensajes()
    if(respuesta):
        return jsonify(respuesta),201
    else:
        return jsonify({"mensaje": "No se pudieron encontrar mensajes"}),400
    
@app.route("/mensajes", methods=["POST"])
def enviar_mensaje():
    # este metodo form puede obtener las variables que vienen en la peticion
    # asumimos que los nombres de las variables son (nombre,apellido,email,telefono)
    nombre = request.form["nombre"]
    apellido = request.form["apellido"]
    email = request.form["email"]
    consulta = request.form["mensaje"]
    respuesta = mensaje.enviar_mensaje(nombre,apellido,email,consulta)
    if(respuesta):
        # retornamos la respuesta a la peticion fetch
        return jsonify({"mensaje": "Se envio tu mensaje con éxito!"}),201
    else:
        return jsonify({"mensaje":"No fue posible enviar el mensaje"}),400


#  en el put siempre el ultimo dato debe ser un id que identifiqeu al registro 

@app.route("/mensajes/<int:id>", methods=["PUT"])
def responder_mensaje(id):
    # asumimos que el campo se llama "gestion"
    gestion = request.form["gestion"]
    respuesta = mensaje.responder_mensaje(id,gestion)
    if(respuesta):
        # retornamos la respuesta a la peticion fetch
        return jsonify({"mensaje": "Mensaje modificado"}),201
    else:
        return jsonify({"mensaje":"No fue posible modificar el mensaje"}),400

# simulacion local como si fuese una direccion de internet de la appweb

@app.route("/mensajes/delete/<int:id>",methods=["DELETE"])
def eliminar_mensaje(id):
    mensaje_eliminado = mensaje.eliminar_mensaje(id)
    return jsonify(mensaje_eliminado),201

@app.route("/mensajes/busqueda/<int:id>",methods=["GET"])
def buscar_mensaje(id):
    mensaje_encontrado = mensaje.buscar_mensaje(id)
    return jsonify(mensaje_encontrado),201

if (__name__ == "__main__"):
    app.run(debug=True)
