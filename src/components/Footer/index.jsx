import React from 'react';
import PropTypes from 'prop-types';
import "./styles.css"

Footer.propTypes = {

};

function Footer(props) {
  return (
    <div class="footer-basic">
      <footer>
        {/* <div class="social">
          <a href="#">
            <i class="icon ion-social-instagram"></i>
          </a>
          <a href="#">
            <i class="icon ion-social-snapchat"></i>
          </a>
          <a href="#">
            <i class="icon ion-social-twitter"></i>
          </a>
          <a href="#">
            <i class="icon ion-social-facebook"></i>
          </a>
        </div> */}
        <ul class="list-inline">
          <li class="list-inline-item">
            <a href="#">Home</a>
          </li>
          <li class="list-inline-item">
            <a href="#">Services</a>
          </li>
          <li class="list-inline-item">
            <a href="#">About</a>
          </li>
          <li class="list-inline-item">
            <a href="#">Terms</a>
          </li>
          <li class="list-inline-item">
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
        <p class="copyright">Thesis © 2023</p>
      </footer>
    </div>
  );
}

export default Footer;
