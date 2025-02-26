import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import Top from "./components/Top";
import Header from "./components/Header";
import SuggestCard from "./components/SuggestCard";
import Card from "./components/Card";
import Container from "./components/Container";
import constants from "./constants/constants.json";
import Button from "./components/Button";
import useData from "./services/store";
import getError from "./contollers/getErrors";
import Footer from "./components/Footer";

type VideoTypes = {
	id: number;
	sequence: number;
	title: string;
	views: number;
	thumb: string;
	approved: string;
	youtube_id: string;
};

const App = () => {
	const [top5Videos, setTop5Videos] = useState<VideoTypes[]>([]);
	const [allVideos, setAllVideos] = useState<VideoTypes[][]>([[]]);
	const [index, setIndex] = useState(1);
	const data = useData();

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response =
					data.isAdmin.value === "1"
						? await axios.get(constants.adminPostGetAPI, {
								headers: {
									Authorization: `Bearer ${data.token.value}`,
									Accept: "application/json",
								},
						  })
						: await axios.get(constants.postGetAPI);
				setTop5Videos(Array.isArray(response.data[0]) ? response.data[0] : []);
				setAllVideos(Array.isArray(response.data) ? response.data : [[]]);
			} catch {
				getError("Houve um erro ao buscar os dados.");
				setTop5Videos([]);
				setAllVideos([[]]);
			}
		};
		fetchVideos();
	}, [data.isAdmin.value, data.token.value]);

	const Pagination = () => {
		const nextPage = () => setIndex(index + 1);
		const prevPage = () => setIndex(index - 1);

		return (
			<div className="pagination">
				<Button
					type="pagination"
					label=" < Anterior"
					onClick={prevPage}
					disabled={index === 1}
				/>
				|
				<Button
					type="pagination"
					label="Próximo >"
					onClick={nextPage}
					disabled={index === allVideos.length - 1}
				/>
			</div>
		);
	};

	return (
		<>
			<Top />
			<Header />
			<Container>
				<SuggestCard />
				<h3>Ranking Atual</h3>
				{Array.isArray(top5Videos) &&
					top5Videos.map((video: VideoTypes) => (
						<Card
							id={video.id}
							youtubeId={video.youtube_id}
							key={video.id}
							views={video.views}
							title={video.title}
							sequence={video.sequence}
							thumb={video.thumb}
							approved={video.approved}
						/>
					))}

				<br />

					
					{allVideos.length > 1 ?<h3>Outros vídeos</h3>:null}
				{Array.isArray(allVideos[index]) &&
					allVideos[index].map((video: VideoTypes) => (
						<Card
							unpopular={true}
							id={video.id}
							youtubeId={video.youtube_id}
							key={video.id}
							views={video.views}
							title={video.title}
							sequence={video.sequence}
							thumb={video.thumb}
							approved={video.approved}
						/>
					))}
				{allVideos.length > 1 ?<Pagination />:null}
			</Container>
			<Footer />
		</>
	);
};

export default App;
