import React, { Component, Fragment } from "react";
import { Card, Row, Col, Input, Button, Alert, Radio, InputNumber } from 'antd'
import { DashboardOutlined} from "@ant-design/icons"

class Marcacion extends React.Component {

    servidorAPI = "http://192.198.10.241:3010/rrhh";

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {txtNumero: "", 
        showAlert : false, 
        alertMessage: "", 
        alertType: "",
        empleado: "",
        radOperacion: "E",
        showButton: true,
        loadingButton: false,
    }
    }

    grabaMarcacion = async (id) => {
        const insertar = await fetch(`${this.servidorAPI}/marcacion/${id}/${this.state.radOperacion}`, {method: "post", headers: {'Content-Type':'application/json'}})
                              .then(async (response) => {
                                console.log("response insertar", response); 
                                if (response.status === 200){
                                  let resultado = await response.json();
                                  //console.log("resultado", resultado.length);
                                  this.setState({showAlert: true, showButton: false, loadingButton: false, alertMessage:`${this.state.empleado}, marcación del ${resultado.fecha}, a las ${resultado.hora}`, alertType: "success"})
                                  
                                  
                                }else{
                                  let resultado = await response.json();
                                  console.log("resultado", resultado);
                                  this.setState({showAlert: true, loadingButton: false, alertMessage:`Error de servidor, no se pudo registrar su marcación` , alertType: "error"})
                                }
      
                              });
      }

      handleInputChange = (e) => {
          console.log("change", e.target);     
          this.setState({ [e.target.name]: e.target.value, showAlert: false });
      };

      

    onsubmit = async values => {
        console.log("submit");
        this.setState({loadingButton: true});
        const consultar = await fetch(`${this.servidorAPI}/empleadoCedula/${this.state.txtNumero}`)
                            .then(async (response) => {
                              console.log("response", response);  
                              
                              if (response.status === 200){
                                let resultado = await response.json();
                                console.log("resultado", resultado);
                                if (resultado.length > 0){
                                    console.log("resultado", resultado.CODIGO);
                                    this.setState({empleado: resultado[0].EMPLEADO})
                                    this.grabaMarcacion(resultado[0].CODIGO);
                                }
                                else{
                                    
                                    this.setState({showAlert: true, loadingButton: false, alertMessage:"Empleado no existe o no esta habilitado", alertType: "warning"})
                                    
                                }
                                
                              }else if (response.status >= 400 && response.status < 500){
                                console.log("Error al consultar empleado")
                                this.setState({showAlert: true, loadingButton: false, alertMessage:`Error de servidor, ${response.statusText}` , alertType: "error"})
                              }else if (response.status >= 500 ){
                                console.log("Error al consultar empleado")
                                this.setState({showAlert: true, loadingButton: false, alertMessage:`Error de servidor, no se pudo registrar su marcación` , alertType: "error"})
                              }
                              
                            });
      
      }
    render(){
        const {loadingButton} = this.state
        return(<Card title="Emapag">
        
        <Row>
            <Col span={18} offset={3} style={{textAlign:"center"}}>
                <h2>Registro de marcaciones</h2>
                <span style={{fontSize:60}}><DashboardOutlined></DashboardOutlined></span>
            </Col>
        </Row>
        <Row>
            <Col span={12} offset={6} style={{textAlign:"center"}}>
            <Radio.Group defaultValue="E" buttonStyle="solid" name="radOperacion" onChange={this.handleInputChange}>
            <Radio.Button value="E">Entrada</Radio.Button>
            <Radio.Button value="S">Salida</Radio.Button>
            </Radio.Group>
            </Col>
        </Row>
         <Row>
             <Col span={24} style={{textAlign:"center"}}>
             <span >Ingrese los 5 últimos dígitos de su cédula</span>
             </Col>
         </Row>
         <Row>
             <Col span={8}>
             </Col>
             <Col span={8} style={{textAlign:"center"}}>
                 
             <Input style={{width:"100px", textAlign:"center"}} maxLength="5" name="txtNumero" onChange={this.handleInputChange} />
             </Col>
             <Col span={8}>
             </Col>
         </Row>
         { this.state.showButton && 
            <Row>
            <Col span={24}>
                <p></p>
            <Button type="primary" block disabled={this.state.txtNumero?.length < 4} onClick={this.onsubmit} loading={loadingButton} >Registrar marcación</Button>
            </Col>
            </Row>
         }
         
        
        <p></p>
       {
            this.state.showAlert &&
            <Alert
      message="Mensaje"
      description={this.state.alertMessage}
      type={this.state.alertType}
      showIcon
    />
       }
        

    </Card>);
    }
}

export default Marcacion