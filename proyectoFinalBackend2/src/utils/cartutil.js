//Generar un codigo unico para el ticket

const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXZabdefghijklmnopqrstuvwxz0123456789';
    const codeLenght = 8;
    let code = '';

    for (let i = 0; i < codeLenght; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    const timestamp = Date.now().toString(36);
    return code + '-' + timestamp;
}

export { generateUniqueCode };
