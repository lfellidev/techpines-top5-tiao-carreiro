import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

import constants from "../../constants/constants.json";
import useData from "../../services/store";
import Button from "../Button";
import getError from "../../contollers/getErrors";
import viewsConvert from "../../contollers/viewsConvert";

type Props = {
	id: number;
	sequence: number;
	title: string;
	views: number;
	thumb: string;
	youtubeId: string;
	approved: string;
	unpopular?: boolean;
};

const Card: React.FC<Props> = ({
	id,
	sequence,
	title,
	views,
	thumb,
	youtubeId,
	approved,
	unpopular,
}) => {
	const data = useData();
	const unpopularProp = unpopular;

	const deleteHandler = async (id: number): Promise<void> => {
		const result = await Swal.fire({
			title: "Tem certeza?",
			text: "Você não poderá reverter esta ação!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sim, deletar!",
			cancelButtonText: "Cancelar",
			customClass: {
				confirmButton: "custom-secondary-button",
				cancelButton: "custom-primary-button",
			},
		});

		if (result.isConfirmed) {
			await axios
				.delete(constants.adminPostDeleteAPI + `/${id}`, {
					headers: {
						Authorization: `Bearer ${data.token.value}`,
					},
				})
				.then(() => {
					window.location.reload();
				})
				.catch((error) => {
					if (
						axios.isAxiosError(error) &&
						error.response &&
						error.response.status === 403
					) {
						getError("Você não tem permissão para deletar este video");
					} else {
						getError("Não foi possível deletar o video");
					}
				});
		}
	};
	const approvedHandler = async (
		id: number,
		approvedValue: boolean
	): Promise<void> => {
		await axios
			.put(
				constants.adminPostUpdateVisibilityAPI + `/${id}`,
				{
					approved: !approvedValue,
				},
				{
					headers: {
						Authorization: `Bearer ${data.token.value}`,
					},
				}
			)
			.then(() => {
				window.location.reload();
			})
			.catch(() => {
				getError("Houve um erro");
			});
	};

	const openVideo = (youtubeId: string): void => {
		window.open(
			`https://www.youtube.com/watch?v=${youtubeId}`,
			"_blank",
			"noopener,noreferrer"
		);
	};

	const editHandler = async (id: number): Promise<void> => {
		const result = await Swal.fire({
			title: "Editar vídeo",
			input: "text",
			inputLabel: "Digite o novo ID do YouTube",
			inputPlaceholder: "ID do vídeo",
			inputValue: `https://www.youtube.com/watch?v=${youtubeId}`,
			showCancelButton: true,
			confirmButtonText: "Salvar",
			cancelButtonText: "Cancelar",
			customClass: {
				confirmButton: "custom-primary-button",
				cancelButton: "custom-secondary-button",
			},
		});

		if (result.isConfirmed && result.value) {
			await axios
				.put(
					constants.adminPostUpdateUrlAPI + `/${id}`,
					{
						youtube_url: `https://www.youtube.com/watch?v=${result.value}`,
					},
					{
						headers: {
							Authorization: `Bearer ${data.token.value}`,
						},
					}
				)
				.then(() => {
					window.location.reload();
				})
				.catch(() => {
					getError("Houve um erro");
				});
		}
	};

	if (!unpopularProp) {
		return (
			<div>
				<div className="card">
					<div className="row cardRow">
						<div className="col-xl-2 col-lg-2 col-md-2 mobile-hidden">
							<div className="cardSequence">{sequence}</div>
						</div>
						<div className="col-xl-7 col-lg-7 col-md-7 col-sm-7">
							<div className="cardInfo">
								<h4>
									<a
										href={`https://www.youtube.com/watch?v=${youtubeId}`}
										rel="noreferrer"
										target="_blank"
									>
										{" "}
										{title}
									</a>
									{data.isAdmin.value == "1" ? (
										approved == "1" ? (
											<span className="published"> (publicado)</span>
										) : (
											<span className="unpublished"> (não publicado)</span>
										)
									) : null}
								</h4>
								<p>{viewsConvert(views)} visualizações</p>
								{data.isAdmin.value == "1" ? (
									<div className="editButton">
										<Button type="trash" onClick={() => deleteHandler(id)} />
										<Button
											type="approve"
											approved={approved}
											onClick={() =>
												approvedHandler(id, approved == "1" ? true : false)
											}
										/>
										<Button type="edit" onClick={() => editHandler(id)} />
									</div>
								) : null}
							</div>
						</div>
						<div className="col-xl-3 col-lg-3 col-md-3 col-sm-5">
							<div className="cardThumb">
								<button
									className="buttonLink"
									onClick={() => openVideo(youtubeId)}
								>
									<img
										src={thumb}
										className="img-fluid"
										width={160}
										height={120}
										alt={title}
									/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<p>
				<a
					href={`https://www.youtube.com/watch?v=${youtubeId}`}
					target="_blank"
					rel="noreferrer"
					className="unpopularCard"
				>
					#{sequence} - {title} ({viewsConvert(views)} visualizações)
				</a>

				{data.isAdmin.value == "1" ? (
					<div className="editButton">
						<Button type="trash" onClick={() => deleteHandler(id)} size={18} />
						<Button
							type="approve"
							approved={approved}
							onClick={() =>
								approvedHandler(id, approved == "1" ? true : false)
							}
							size={18}
						/>
						<Button type="edit" onClick={() => editHandler(id)} size={18} />
						<br />
					</div>
				) : null}
			</p>
		);
	}
};

export default Card;
