import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function ContactBook() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem("contacts"));
    if (!storedContacts) {
      setContacts(storedContacts);
    } else {
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          setContacts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditContact = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    setEditingContact(contactToEdit);
    setFormData(contactToEdit);
  };

  const handleSaveContact = (event) => {
    event.preventDefault();
    if (editingContact) {
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id ? formData : contact
      );
      setContacts(updatedContacts);
      setEditingContact(null);
    } else {
      const newContact = {
        ...formData,
        id: contacts.length + 1,
      };
      setContacts([...contacts, newContact]);
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleDeleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
  };

  const handleSaveClick = () => {};

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container>
      <Title variant="h3">Contact Book</Title>
      <FormContainer>
        <SearchInput
          label="Search"
          variant="outlined"
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={() => setEditingContact({})}>
          Add Contact
        </Button>
      </FormContainer>
      {editingContact ? (
        <EditFormContainer onSubmit={handleSaveContact}>
          <EditFormInput
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <EditFormInput
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <EditFormInput
            label="Phone"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <ButtonContainer>
            <Button onClick={handleSaveClick} variant="contained" type="submit">
              Save
            </Button>
            <Button variant="contained" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </ButtonContainer>
        </EditFormContainer>
      ) : (
        <CardContainer>
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id}>
              <CardContent>
                <CardTitle variant="h5">{contact.name}</CardTitle>
                <Typography>Email: {contact.email}</Typography>
                <Typography>Phone: {contact.phone}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleEditContact(contact.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </ContactCard>
          ))}
        </CardContainer>
      )}
    </Container>
  );
}

export default ContactBook;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(Typography)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
`;

const SearchInput = styled(TextField)`
  width: 300px;
  margin-right: 16px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardTitle = styled(Typography)`
  margin-bottom: 16px;
`;

const ContactCard = styled(Card)`
  width: 600px;
  margin-bottom: 16px;
`;

const EditFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditFormInput = styled(TextField)`
  width: 300px;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 8px;
`;
