import React from 'react';
import { useEffect, useState } from 'react';

import InputMask from 'react-input-mask';
import './form.scss';

function Form() {

    const [inputValue, setInputValue] = useState({
        name: '',
        email: '',
        phone: '',
        bday: '',
        message: ''
    })

    const [inputDirty, setInputDirty] = useState({
        name: false,
        email: false,
        phone: false,
        bday: false,
        message: false
    })

    const [inputError, setInputError] = useState({
        name: "Имя не может быть пустым",
        email: "Электронная почта не может быть пустой",
        phone: "Телефон не может быть пустым",
        bday: "Дата рождения не может быть пустой",
        message: "Сообщение не может быть пустым"
    })

    const [formValid, setFormValid] = useState(false);
    const [response, setResponse] = useState("");
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {

        if (inputError.name || inputError.email || inputError.phone || inputError.bday || inputError.message) {
            setFormValid(false);
        }
        else {
            setFormValid(true);
        }

    }, [inputError.name, inputError.email, inputError.phone, inputError.bday, inputError.message])

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputValue({ ...inputValue, name: e.target.value });

        const regex = /[A-Za-z0-9]/;
        const str = e.target.value.split(" ");

        if (e.target.value.length === 0) {
            setInputError({ ...inputError, name: "Имя не может быть пустым" });
        }
        else if (!regex.test(String(e.target.value).toLowerCase())) {
            setInputError({ ...inputError, name: "Имя и фамилия должны быть написаны латинскими буквами" });
        }
        else if (str.length !== 2) {
            setInputError({ ...inputError, name: "Имя и фамилия должна стостоять из двух слов" });
        }
        else if (str.length === 2) {
            for (let index = 0; index < str.length; index++) {
                if (str[index].length < 3 || str[index].length > 30) {
                    setInputError({ ...inputError, name: "Минимальная длина каждого слова 3 символа, максимальная 30" });
                }
                else if (!regex.test(String(str[index]).toLowerCase())) {
                    setInputError({ ...inputError, name: "Имя и фамилия должны быть написаны латинскими буквами" });
                }
                else {
                    setInputError({ ...inputError, name: "" });
                }
            }
        }
        else {
            setInputError({ ...inputError, name: "" })
        }
    }

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputValue({ ...inputValue, email: e.target.value });
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(String(e.target.value).toLowerCase())) {
            setInputError({ ...inputError, email: "Некоректная электронная почта" });

            if (e.target.value.length === 0) {
                setInputError({ ...inputError, email: "Электронная почта не может быть пустой" });
            }
        }
        else {
            setInputError({ ...inputError, email: "" });
        }
    }

    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputValue({ ...inputValue, phone: e.target.value });

        if (e.target.value.length === 0 || e.target.value.includes("_")) {
            setInputError({ ...inputError, phone: "Телефон не может быть пустым" });
        }
        else {
            setInputError({ ...inputError, phone: "" });
        }
    }

    const onBdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setInputValue({ ...inputValue, bday: e.target.value });

        const date = new Date(e.target.value);
        if (date.getTime() > Date.now()) {
            setInputError({ ...inputError, bday: "Вы не можете родиться в будущем" });
        }
        else {
            setInputError({ ...inputError, bday: "" });
        }
    }

    const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue({ ...inputValue, message: e.target.value });

        if (e.target.value.length < 10 || e.target.value.length > 300) {
            setInputError({ ...inputError, message: "Сообщение не может быть меньше 10 символов и больше 300" });

            if (e.target.value.length === 0) {
                setInputError({ ...inputError, message: "Сообщение не может быть пустым" });
            }
        }
        else {
            setInputError({ ...inputError, message: "" });
        }
    }

    const clearInput = () => {
        setInputValue({
            name: '',
            email: '',
            phone: '',
            bday: '',
            message: ''
        })
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setisLoading(true);

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "Form request",
                body: {
                    name: inputValue.name,
                    email: inputValue.email,
                    phone: inputValue.phone,
                    bday: inputValue.bday,
                    message: inputValue.message
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                setisLoading(false);
                setResponse(`success: ${JSON.stringify(data)}`);
                clearInput();
            })
            .catch(error => {
                setisLoading(false);
                setResponse(`error: ${error.message}`)
            })
    }

    const blurHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        switch (e.target.name) {
            case 'name':
                setInputDirty({ ...inputDirty, name: true })
                break;
            case 'email':
                setInputDirty({ ...inputDirty, email: true })
                break;
            case 'phone':
                setInputDirty({ ...inputDirty, phone: true })
                break
            case 'bday':
                setInputDirty({ ...inputDirty, bday: true })
                break;
            case 'message':
                setInputDirty({ ...inputDirty, message: true })
                break;
            default:
                break;
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>

            <input name="name" placeholder="Имя и фамилия" value={inputValue.name.toUpperCase()} onChange={onNameChange} onBlur={e => blurHandler(e)} />
            {(inputDirty.name && inputError.name) && <label>{inputError.name}</label>}

            <input name="email" placeholder="Электронная почта" value={inputValue.email} onChange={onEmailChange} onBlur={e => blurHandler(e)} />
            {(inputDirty.email && inputError.email) && <label>{inputError.email}</label>}

            <InputMask name="phone" placeholder="Мобильный телефон" value={inputValue.phone} onChange={onPhoneChange} onBlur={e => blurHandler(e)} mask="+7 (999) 999-99-99" ></InputMask>
            {(inputDirty.phone && inputError.phone) && <label>{inputError.phone}</label>}

            <input name="bday" placeholder="Дата рождения" type="date" value={inputValue.bday} onChange={onBdayChange} onBlur={e => blurHandler(e)} />
            {(inputDirty.bday && inputError.bday) && <label>{inputError.bday}</label>}

            <textarea name="message" placeholder="Сообщение" value={inputValue.message} onChange={onMessageChange} onBlur={e => blurHandler(e)}></textarea>
            {(inputDirty.message && inputError.message) && <label>{inputError.message}</label>}

            <button type="submit" disabled={!formValid || isLoading}>Отправить</button>

            {(formValid) && <label style={{ color: `${response.includes("error") ? 'red' : 'green'}` }}>{response}</label>}

        </form>
    )
}

export default Form;