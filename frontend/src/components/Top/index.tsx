import React, { useState } from "react";
import axios from "axios";
import useData from "../../services/store";
import constants from "../../constants/constants.json";
import Button from "../Button";
import LoginBox from "../LoginBox";
import SignupBox from "../SignupBox";

const Top = () => {
	const data = useData();
	const [model, setModal] = useState(<></>);

	const TopElement = () => {
		if (typeof data.token.value !== "undefined") {
			return (
				<>
					<p>
						Olá {data.user.name} |
						<button className="buttonLink" onClick={logoutHandler}>
							Sair
						</button>
					</p>
				</>
			);
		} else {
			return (
				<>
					<Button
						type="link"
						label="Fazer Login"
						onClick={() => setModal(<LoginBox />)}
					/>
					&nbsp;|&nbsp;
					<Button
						type="link"
						label="Cadastrar"
						onClick={() => setModal(<SignupBox />)}
					/>
				</>
			);
		}
	};

	const [topContent, setTopContent] = useState(<TopElement />);

	const logoutHandler = () => {
		axios
			.post(
				constants.userLogoutAPI,
				{},
				{
					headers: {
						Authorization: `Bearer ${data.token.value}`,
					},
				}
			)
			.then(() => {
				data.token.clear();
				data.user.clear();
				data.isAdmin.clear();
				setTopContent(
					<button className="buttonLink" onClick={() => setModal(<LoginBox />)}>
						Fazer Login
					</button>
				);
				window.location.href = "/";
			})
			.catch((error) => {
				data.token.clear();
				data.user.clear();
				window.location.href = "/";
			});
	};

	return (
		<div className="top">
			<div className="container">
				{model} {topContent}
			</div>
		</div>
	);
};

export default Top;
