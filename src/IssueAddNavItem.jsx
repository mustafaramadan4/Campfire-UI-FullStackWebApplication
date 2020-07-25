import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAdd;
    const contact = {
      // Updated the names of the issue variables. Still need the specific contact information fields..i.e. phone, email..
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      LinkedIn: form.LinkedIn.value,
      // due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    /* TO DO: the add form needs to handle submit, the query string has been updated with the mutation api call to contactAdd. 
    // It is just not adding the contact to the DB upon submit click.
    */

   const query = `mutation contactAdd($contact: ContactInputs!) {
    contactAdd(contact: $contact) {
      id name email phone LinkedIn
    }
  }`;

    // const query = `mutation issueAdd($issue: IssueInputs!) {
    //   issueAdd(issue: $issue) {
    //     id
    //   }
    // }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { contact }, showError);
    // updated graphQL var pass from issue to contact
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.contactAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-issue">Add Contact</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Contact (min. 1 contact information field required)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd">
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email*</ControlLabel>
                <FormControl name="email" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Phone Number*</ControlLabel>
                <FormControl name="phone" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>LinkedIn*</ControlLabel>
                <FormControl name="LinkedIn" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withToast(withRouter(IssueAddNavItem));
