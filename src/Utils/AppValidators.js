export default class AppValidators {
    static validateEmail(email) {
        // Email validation logic
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    static validatePhone(phone) {
        // Phone validation logic
        return this.validateRequiredField(phone, 10);
        // return /^\d{11}$/.test(pho
    }

    static validateRequiredField(value, length = 5) {
        // Required field validation logic
        return value.trim().length > length;
    }

    static validatePassword(password) {
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[A-Za-z\d\S]{8,}$/;

        return passwordRegex.test(password);
    }
}
