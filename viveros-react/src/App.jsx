import {

useEffect,
useState

} from "react";

import {

collection,
getDocs

} from "firebase/firestore";

import { db } from "./firebase";

import {

AppBar,
Toolbar,
Typography,
Button,
Container,
Grid,
Card,
CardMedia,
CardContent,
CardActions,
Box,
CircularProgress,
Drawer,
IconButton,
Divider

} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import SpaIcon from "@mui/icons-material/Spa";

import DeleteIcon from "@mui/icons-material/Delete";

function App(){

const [

plantas,
setPlantas

] = useState([]);

const [

carrito,
setCarrito

] = useState([]);

const [

loading,
setLoading

] = useState(true);

const [

openCarrito,
setOpenCarrito

] = useState(false);

const [

loadingPago,
setLoadingPago

] = useState(false);

/* =========================
OBTENER PLANTAS
========================= */

useEffect(() => {

obtenerPlantas();

}, []);

async function obtenerPlantas(){

try{

const querySnapshot =

await getDocs(

collection(
db,
"plantas"
)

);

const plantasFirebase = [];

querySnapshot.forEach(doc => {

plantasFirebase.push({

id:doc.id,

...doc.data()

});

});

setPlantas(
plantasFirebase
);

}catch(error){

console.log(
"ERROR FIREBASE:",
error
);

}

setLoading(false);

}

/* =========================
AGREGAR CARRITO
========================= */

function agregarCarrito(planta){

setCarrito(prev => [

...prev,

planta

]);

}

/* =========================
ELIMINAR PRODUCTO
========================= */

function eliminarProducto(index){

const nuevoCarrito =

[...carrito];

nuevoCarrito.splice(index,1);

setCarrito(nuevoCarrito);

}

/* =========================
TOTAL
========================= */

const total =

carrito.reduce(

(acumulador,producto) =>

acumulador +
Number(producto.precio),

0

);

/* =========================
FINALIZAR COMPRA
========================= */

async function finalizarCompra(){

if(
carrito.length === 0
){

alert(
"❌ El carrito está vacío"
);

return;

}

try{

setLoadingPago(true);

const response =
await fetch(

"https://backend-viveros.onrender.com/crear-pago",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

productos:
carrito

})

}

);

const session =
await response.json();

console.log(
"SESSION:",
session
);

if(
session.url
){

window.location.href =
session.url;

}else{

alert(
"❌ Stripe no devolvió URL"
);

console.log(session);

}

}catch(error){

console.log(
"ERROR REAL:",
error
);

alert(
"❌ Error con Stripe"
);

}

setLoadingPago(false);

}

return(

<>

<AppBar

position="static"

sx={{

background:
"linear-gradient(90deg,#1B5E20,#2E7D32)",

boxShadow:4

}}

>

<Toolbar>

<SpaIcon

sx={{

mr:2,
fontSize:35

}}

/>

<Typography

variant="h5"

sx={{

flexGrow:1,
fontWeight:"bold",
letterSpacing:1

}}

>

Viveros Estanislao

</Typography>

<Button

color="inherit"

startIcon={<ShoppingCartIcon />}

onClick={() => {

setOpenCarrito(true);

}}

sx={{

fontWeight:"bold",
borderRadius:3,
px:3

}}

>

Carrito ({carrito.length})

</Button>

</Toolbar>

</AppBar>

{/* =========================
DRAWER
========================= */}

<Drawer

anchor="right"

open={openCarrito}

onClose={() => {

setOpenCarrito(false);

}}

>

<Box

sx={{

width:350,
p:3

}}

>

<Typography

variant="h4"

fontWeight="bold"

mb={3}

>

🛒 Carrito

</Typography>

<Divider />

{

carrito.length === 0 ?

(

<Typography

mt={4}

color="text.secondary"

>

No hay productos 😢

</Typography>

)

:

(

<>

{

carrito.map(

(producto,index) => (

<Box

key={index}

sx={{

display:"flex",
alignItems:"center",
gap:2,
my:3

}}

>

<img

src={producto.imagen}

alt={producto.nombre}

style={{

width:"80px",
height:"80px",
objectFit:"cover",
borderRadius:"15px"

}}

/>

<Box

sx={{

flexGrow:1

}}

>

<Typography

fontWeight="bold"

>

{producto.nombre}

</Typography>

<Typography

sx={{

color:"#2E7D32",
fontWeight:"bold"

}}

>

${producto.precio}

</Typography>

</Box>

<IconButton

color="error"

onClick={() => {

eliminarProducto(index);

}}

>

<DeleteIcon />

</IconButton>

</Box>

)

)

}

<Divider />

<Typography

variant="h5"

fontWeight="bold"

mt={3}

>

Total: ${total}

</Typography>

<Button

variant="contained"

fullWidth

disabled={loadingPago}

onClick={finalizarCompra}

sx={{

mt:3,
background:"#2E7D32",
py:1.5,
fontWeight:"bold",

"&:hover":{

background:"#1B5E20"

}

}}

>

{

loadingPago

?

"Procesando..."

:

"Continuar compra"

}

</Button>

</>

)

}

</Box>

</Drawer>

{/* =========================
CONTENIDO
========================= */}

<Box

sx={{

background:
"linear-gradient(to bottom,#F1F8E9,#ffffff)",

minHeight:"100vh",
py:6

}}

>

<Container maxWidth="xl">

<Box

sx={{

textAlign:"center",
mb:8

}}

>

<Typography

variant="h2"

fontWeight="bold"

sx={{

color:"#1B5E20",
mb:2

}}

>

Catálogo Premium

</Typography>

<Typography

variant="h5"

sx={{

color:"#4E5D52",
fontWeight:500

}}

>

Encuentra plantas increíbles para tu hogar 🌿

</Typography>

</Box>

{

loading ?

(

<Box

sx={{

display:"flex",
justifyContent:"center",
mt:10

}}

>

<CircularProgress />

</Box>

)

:

(

<Grid

container

spacing={5}

sx={{

justifyContent:"center"

}}

>

{

plantas.map(planta => (

<Grid

key={planta.id}

size={{

xs:12,
sm:6,
md:4

}}

>

<Card

sx={{

borderRadius:6,

overflow:"hidden",

transition:"0.3s",

boxShadow:5,

background:"#fff",

height:"100%",

display:"flex",

flexDirection:"column",

"&:hover":{

transform:"translateY(-10px)",

boxShadow:10

}

}}

>

<CardMedia

component="img"

height="320"

image={planta.imagen}

alt={planta.nombre}

/>

<CardContent

sx={{

textAlign:"center",
py:4,
flexGrow:1

}}

>

<Typography

variant="h4"

fontWeight="bold"

sx={{

mb:2,
color:"#263238"

}}

>

{planta.nombre}

</Typography>

<Typography

variant="h5"

sx={{

color:"#2E7D32",
fontWeight:"bold"

}}

>

${planta.precio}

</Typography>

</CardContent>

<CardActions

sx={{

px:3,
pb:3

}}

>

<Button

variant="contained"

fullWidth

startIcon={<ShoppingCartIcon />}

onClick={() => {

agregarCarrito(planta);

}}

sx={{

background:"#2E7D32",

fontWeight:"bold",

py:1.5,

borderRadius:4,

fontSize:"1rem",

"&:hover":{

background:"#1B5E20"

}

}}

>

Agregar al carrito

</Button>

</CardActions>

</Card>

</Grid>

))

}

</Grid>

)

}

</Container>

</Box>

</>

);

}

export default App;