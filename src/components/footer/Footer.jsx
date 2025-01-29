import { styled } from "@mui/material";
import Container from "../layout/Container";

const FooterStyled = styled("footer")({
  backgroundColor: "#111821",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  "& .footer-wrapper": {
    paddingTop: "4.5rem",
    paddingBottom: "4.5rem",
  },
  "& .copyright-disclaimer": {
    color: "#a3a3a3",
    backgroundColor: "##111111",
    padding: "2.5rem 1.25rem",
  },
});

function Footer() {
  return (
    <Container>
      <FooterStyled>
        <div className="footer-wrapper">
        <div className="">
          <div className="widget widget_text attorna-widget">
            <h3 className="attorna-widget-title">PILIOS AND PARTNERS</h3>
            <span className="clear"></span>
            <div className="textwidget">
              <span className="gdlr-core-space-shortcode" style="margin-top: -27px ;"></span>
              <p>LAW FIRM<br>
              The Business Law Boutique in Greece<br> Specialized in advising investors and companies from abroad
              </p>
              <div className="gdlr-core-social-network-item gdlr-core-item-pdb  gdlr-core-none-align" style="padding-bottom: 0px ;">
                <a href="https://gr.linkedin.com/in/michail-pilios-02010a15" target="_blank" className="gdlr-core-social-network-icon" title="linkedin" style="font-size: 16px ;color: #b1976b ;">
                <i className="fa fa-linkedin"></i></a><a href="#" target="_blank" className="gdlr-core-social-network-icon" title="skype" style="font-size: 16px ;color: #b1976b ;"><i className="fa fa-skype"></i></a><a href="https://twitter.com/michailpilios" target="_blank" className="gdlr-core-social-network-icon" title="twitter" style="font-size: 16px ;color: #b1976b ;"><i className="fa fa-twitter"></i></a></div>
</div>
		</div></div>
        </div>
        <div className="copyright-disclaimer">
          Copyright 2024 PILIOS AND PARTNERS | LAW FIRM, All Rights Reserved
        </div>
      </FooterStyled>
    </Container>
  );
}

export default Footer;
