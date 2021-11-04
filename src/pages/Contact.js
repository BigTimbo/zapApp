import React from 'react';
import '../CSS/Contact.css';

function Contact() {
    return (
        <div className="contact">
            <div className="contactContent">
                <form className="contactForm">
                    <h1>Contact</h1>
                    <h2>Contact us today, and we will reply as soon as we can!</h2>
                    <fieldset>
                        <legend>
                            <h2><label htmlFor="fullName">Name</label></h2>
                        </legend>
                        <input placeholder="Your name" type="text" name="fullName" className="fullName" autoFocus />
                            <span className="name_error" />
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2><label htmlFor="email">Email</label></h2>
                        </legend>
                        <input placeholder="Your Email Address" type="text" name="email" className="email" />
                            <span className="email_error" />
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2><label htmlFor="subject">Subject</label></h2>
                        </legend>
                        <input placeholder="Type your subject here...." type="text" name="subject" className="subject" />
                            <span className="subject_error" />
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2><label htmlFor="query">Message</label></h2>
                        </legend>
                        <textarea placeholder="Type your Message Here...." name="query" className="query" />
                        <span className="message_error" />
                    </fieldset>
                    <input name="btnSubmit" type="submit" className="submit" value="Submit"/>
                </form>
            </div>
        </div>
    )
}
export default Contact;