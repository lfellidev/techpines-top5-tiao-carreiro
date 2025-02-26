import React, { useState } from "react";
import Swal from "sweetalert2";import axios from "axios";
import getError from "../../contollers/getErrors";
import useData from "../../services/store";
import constants from "../../constants/constants.json";
import Button from "../Button";

const SuggestCard = () => {
	const data = useData();
	const [url, setUrl] = useState("");

	const handleSubmit = () => {

    if (data.token.value !== undefined) {
			if (data.isAdmin.value!=="1") {
        axios.post(constants.postSuggestAPI, {
          youtube_url: url,
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token.value}`,
          },
        }).then(() => {
				  	Swal.fire({
							title: "Vídeo sugerido com sucesso!",
							text: "Aguarde a aprovação do administrador",
							icon: "success",
							confirmButtonText: "Ok",
							customClass: {
								confirmButton: "custom-primary-button",
							},
          	}).then((result) => {
            if (result.isConfirmed) {
             	window.location.href = "/";
            }
          });
        }).catch(() => {
          getError("Erro ao sugerir música");
        });
			} else{
				axios.post(constants.adminPostSuggestAPI, {
          youtube_url: url,
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token.value}`,
          },
        }).then(() => {
					window.location.href = "/";
			  }).catch(() => {
          getError("Erro ao sugerir música");
        });
			}
    } else getError("Faça login para sugerir uma música");
	};

	return (
		<div className="card mySuggestCard">
			<h3 className="title">Sugerir Nova Música</h3>
			<div className="form-group row">
				<div className="col-xl-10 col-lg-10 col-md-10 col-sm-10">
					<input
						type="text"
						className="form-control"
						onChange={(e) => setUrl(e.target.value)}
						value={url}
					/>
				</div>
				<div className="col-xl-2 col-lg-2 col-md-2 col-sm-2">
					<Button type="add" onClick={handleSubmit} />
				</div>
			</div>
		</div>
	);
};

export default SuggestCard;
