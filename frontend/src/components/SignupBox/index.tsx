import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import constants from "../../constants/constants.json";
import useData from "../../services/store";

const SignupBox = () => {
    const data = useData();
    const MySwal = withReactContent(Swal);

    const signup = async (
        fullName: string,
        email: string,
        password: string,
        passwordConfirm: string
    ) => {
        return await axios.post(constants.userSignupAPI, {
            name: fullName,
            email: email,
            password: password,
            password_confirmation: passwordConfirm,
        });
    };

    useEffect(() => {
        handleSignup();
    });

    const handleSignup = () => {
        MySwal.fire({
            title: "Criar uma conta",
            html: `
            <input type="text" id="fullName" class="swal2-input" placeholder="Seu nome">
            <input type="email" id="email" class="swal2-input" placeholder="Seu e-mail">
            <input type="password" id="password" class="swal2-input" placeholder="Sua senha">
            <input type="password" id="passwordConfirm" class="swal2-input" placeholder="Confirmação de senha">
            `,
            confirmButtonColor: "#8B4513",
            confirmButtonText: "Criar",
            focusConfirm: false,
            preConfirm: () => {
                const fullNameInput = Swal.getPopup()?.querySelector("#fullName") as HTMLInputElement;
                const emailInput = Swal.getPopup()?.querySelector("#email") as HTMLInputElement;
                const passwordInput = Swal.getPopup()?.querySelector("#password") as HTMLInputElement;
                const passwordConfirmInput = Swal.getPopup()?.querySelector("#passwordConfirm") as HTMLInputElement;

                const fullName = fullNameInput?.value;
                const email = emailInput?.value;
                const password = passwordInput?.value;
                const passwordConfirm = passwordConfirmInput?.value;

                if (fullName.length < 4 || fullName.length > 50) {
                    Swal.showValidationMessage("Nome inválido");
                    return false;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    Swal.showValidationMessage("Endereço de e-mail inválido.");
                    return false;
                }

                if (password.length < 8) {
                    Swal.showValidationMessage("A senha deve conter no mínimo 8 caracteres");
                    return false;
                }

                if (password.length > 50) {
                    Swal.showValidationMessage("O campo senha deve conter no máximo 50 caracteres");
                    return false;
                }

                if (password !== passwordConfirm) {
                    Swal.showValidationMessage("A senha e a confirmação de senha precisam ser iguais");
                    return false;
                }

                return signup(fullName, email, password, passwordConfirm)
                    .then((response) => {
                        return { email, response };
                    })
                    .catch((error) => {
                        return { email, error };
                    });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value.response && result.value.response.status === 201) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Cadastro efetuado com sucesso!',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: "#8B4513",
                    }).then(() => {
                        data.token.set(result.value.response.data.token);
                        data.user.setName(result.value.response.data.name);
                        data.isAdmin.set(result.value.response.data.isAdmin);
                        window.location.href = "/";
                    });
                } else {
                    MySwal.fire({
                        icon: "error",
                        title: "Erro",
                        text: "Email ou senha inválidos",
                    });
                }
            }
        })
        .catch(() => {
            MySwal.fire({
                icon: "error",
                title: "Erro",
                text: "Ocorreu um erro durante o login",
            });
        });
    };

    return null;
};

export default SignupBox;
