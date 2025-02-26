const viewsConvert = (numero: number): string =>{
	if (numero >= 1000000000) {
			return (numero / 1000000000).toFixed(1) + 'B';
	}
	if (numero >= 1000000) {
			return (numero / 1000000).toFixed(1) + 'M';
	}
	if (numero >= 1000) {
			return (numero / 1000).toFixed(1) + 'K';
	}
	return numero.toString();
}

export default viewsConvert;