import swaggerJSDoc from "swagger-jsdoc"
import __dirname from '../dirname.js'

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: "Documentación de Vive y Suelta",
            description: "API Vive y Suelta"
        }
    },
    apis:[
        `${__dirname}/docs/Products/Products.yaml`,
        `${__dirname}/docs/Carts/Carts.yaml`
    ]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec