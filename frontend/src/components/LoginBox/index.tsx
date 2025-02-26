import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import constants from "../../constants/constants.json";
import useData from "../../services/store";
import getError from "../../contollers/getErrors";

const LoginBox = () => {
	const data = useData();
	const MySwal = withReactContent(Swal);

	const getLogin = async (email: string, password: string) => {
		return await axios.post(constants.userLoginAPI, {
			email: email,
			password: password,
		});
	};

	useEffect(() => {
		handleLogin();
	});

	const handleLogin = () => {
		MySwal.fire({
			title: "Login",
			html: `
        <input type="email" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Senha">
      `,

			confirmButtonText: "Entrar",
			showCancelButton: true,
			cancelButtonText: "Cancelar",
			focusConfirm: false,
			customClass: {
				confirmButton: "custom-primary-button",
				cancelButton: "custom-secondary-button",
			},
			preConfirm: () => {
				const emailInput = Swal.getPopup()?.querySelector(
					"#email"
				) as HTMLInputElement;
				const passwordInput = Swal.getPopup()?.querySelector(
					"#password"
				) as HTMLInputElement;

				const email = emailInput?.value;
				const password = passwordInput?.value;

				if (!email || !password) {
					Swal.showValidationMessage(`Por favor, preencha ambos os campos`);
					return false;
				}

				return getLogin(email, password)
					.then((response) => {
						return { email, response };
					})
					.catch((error) => {
						return { email, error };
					});
			},
		})
			.then((result) => {
				if (result.isConfirmed) {
					if (result.value.response && result.value.response.status === 200) {
						data.token.set(result.value.response.data.token);
						data.user.setName(result.value.response.data.name);
						data.isAdmin.set(result.value.response.data.isAdmin);
						window.location.href = "/";
					} else {
						getError("Email ou senha inválidos");
					}
				}
			})
			.catch(() => {
				getError("Ocorreu um erro durante o login");
			});
	};

	return null;
};

export default LoginBox;
