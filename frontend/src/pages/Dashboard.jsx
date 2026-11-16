
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import {
    setBooks,
    addBook,
    updateBook,
    deleteBook,
    setLoading,
    setError,
} from "../features/book/bookSlice"

import { logout as logoutAction } from "../features/auth/authSlice";



const validationSchema = Yup.object({

    title: Yup.string()
        .required("Title is required"),

    author: Yup.string()
        .required("Author is required"),

    price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than zero")
        .required("Price is required"),

    published_year: Yup.number()
        .typeError("Year must be a number")
        .integer("Year must be a whole number")
        .required("Published year is required"),

});



const emptyValues = {
    title: "",
    author: "",
    price: "",
    published_year: "",
};



function getErrorMessage(error) {

    const data = error.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.detail) {
        return data.detail;
    }

    if (data) {

        return Object.entries(data)
            .map(([field, messages]) => {

                const message = Array.isArray(messages)
                    ? messages.join(", ")
                    : messages;

                return `${field}: ${message}`;

            })
            .join(" | ");

    }

    return error.message || "Something went wrong";

}


function Dashboard() {

   
    const dispatch = useDispatch();

    const navigate = useNavigate();


   
    const {
        books = [],
        loading,
        error
    } = useSelector((state) => state.books);



    const user = useSelector(
        (state) => state.auth.user
    );


   
    const [editingBook, setEditingBook] = useState(null);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);


   
    useEffect(() => {

        async function fetchBooks() {

            try {

                dispatch(setLoading(true));

                dispatch(setError(null));


                const response = await api.get("books/");


               
                const results = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];


          
                dispatch(setBooks(results));


            } catch (error) {

                dispatch(setError(getErrorMessage(error)));

            } finally {

                dispatch(setLoading(false));

            }

        }

        fetchBooks();

    }, [dispatch]);


  
    async function handleSubmit(values, { resetForm }) {

        try {

            setSaving(true);

            dispatch(setError(null));


            
            const bookData = {
                ...values,
                price: Number(values.price),
                published_year: Number(values.published_year)
            };


            if (editingBook) {

                const response = await api.put(
                    `books/${editingBook.id}/`,
                    bookData
                );

                
                dispatch(updateBook(response.data));

                setEditingBook(null);


            } else {

            
                const response = await api.post(
                    "books/",
                    bookData
                );

                
                dispatch(addBook(response.data));

            }


            
            resetForm();


        } catch (error) {

            dispatch(setError(getErrorMessage(error)));

        } finally {

            setSaving(false);

        }

    }


    function handleEdit(book) {

        setEditingBook(book);

    }


  
    function handleCancelEdit() {

        setEditingBook(null);

    }



    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);

            dispatch(setError(null));


            
            await api.delete(`books/${id}/`);


            
            dispatch(deleteBook(id));


           
            if (editingBook?.id === id) {
                setEditingBook(null);
            }


        } catch (error) {

            dispatch(setError(getErrorMessage(error)));

        } finally {

            setDeletingId(null);

        }

    }


    async function handleLogout() {

        const refresh = localStorage.getItem("refresh");


        try {

            if (refresh) {

                await api.post("logout/", {
                    refresh
                });

            }

        } catch (error) {

            console.error("Logout request failed:", error);

        } finally {

           
            localStorage.removeItem("access");

            localStorage.removeItem("refresh");


            dispatch(logoutAction());


          
            navigate("/login");

        }

    }


   
    return (

        <div className="container">



            <header className="header">

                <div>

                    <h1>Larmecks Library</h1>

                    <p>
                        Welcome, {user?.username || "User"}
                    </p>

                </div>


                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>


            <hr />


        

            <h2>
                {editingBook ? "Edit Book" : "Add New Book"}
            </h2>


            {error && (
                <p className="error">{error}</p>
            )}


            <Formik

                key={editingBook?.id || "new-book"}

                initialValues={{
                    title: editingBook?.title || "",
                    author: editingBook?.author || "",
                    price: editingBook?.price || "",
                    published_year: editingBook?.published_year || ""
                }}

                validationSchema={validationSchema}

                onSubmit={handleSubmit}

                enableReinitialize

            >

                <Form className="book-form">


                    <label>Book title</label>

                    <Field
                        type="text"
                        name="title"
                        placeholder="Enter book title"
                    />

                    <ErrorMessage
                        name="title"
                        component="div"
                        className="error"
                    />


                    <label>Author</label>

                    <Field
                        type="text"
                        name="author"
                        placeholder="Enter author"
                    />

                    <ErrorMessage
                        name="author"
                        component="div"
                        className="error"
                    />


                    <label>Price</label>

                    <Field
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        step="0.01"
                    />

                    <ErrorMessage
                        name="price"
                        component="div"
                        className="error"
                    />


                    <label>Published year</label>

                    <Field
                        type="number"
                        name="published_year"
                        placeholder="Enter published year"
                    />

                    <ErrorMessage
                        name="published_year"
                        component="div"
                        className="error"
                    />


                    <button
                        type="submit"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : editingBook
                                ? "Update Book"
                                : "Add Book"
                        }

                    </button>


                    {editingBook && (

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                        >

                            Cancel Editing

                        </button>

                    )}

                </Form>

            </Formik>


            <hr />


          

            <h2>Available Books</h2>


            {loading && (
                <p>Loading books...</p>
            )}


            {!loading && books.length === 0 && (
                <p>No books available.</p>
            )}


            <div className="book-list">

                {books.map((book) => (

                    <div
                        className="book-card"
                        key={book.id}
                    >

                        <h3>{book.title}</h3>

                        <p>
                            Author: {book.author}
                        </p>

                        <p>
                            Price: {book.price}
                        </p>

                        <p>
                            Published year: {book.published_year}
                        </p>


                        <button
                            onClick={() => handleEdit(book)}
                        >

                            Edit

                        </button>


                        <button
                            onClick={() => handleDelete(book.id)}
                            disabled={deletingId === book.id}
                        >

                            {deletingId === book.id
                                ? "Deleting..."
                                : "Delete"
                            }

                        </button>

                    </div>

                ))}

            </div>


        </div>

    );

}


export default Dashboard;


