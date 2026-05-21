const imagen =
document.getElementById("imagen");

const preview =
document.getElementById("preview");

imagen.addEventListener("change", async e => {

    const archivo = e.target.files[0];

    if(!archivo) return;

    preview.src =
    URL.createObjectURL(archivo);

    preview.style.display = "block";

    const data = new FormData();

    data.append("file", archivo);

    data.append(
        "upload_preset",
        "vivero_preset"
    );

    try{

        const respuesta =
        await fetch(

            "https://api.cloudinary.com/v1_1/dl4deswbo/image/upload",

            {

                method:"POST",

                body:data

            }

        );

        const resultado =
        await respuesta.json();

        window.imagenURL =
        resultado.secure_url;

        alert(
            "Imagen subida correctamente"
        );

        console.log(window.imagenURL);

    }catch(error){

        console.log(error);

    }

});