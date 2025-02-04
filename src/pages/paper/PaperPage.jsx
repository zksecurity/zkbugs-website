import { styled, Typography } from "@mui/material";
import SmallContainer from "../../components/layout/SmallContainer";
import CodeBlock from "../../components/code-block/CodeBlock";

const PDF_URL = "https://arxiv.org/pdf/2402.15293v4";
const PAPER_SUBJECT = "Systematization of Knowledge (SoK)";
const PAPER_TITLE = "What Don’t We Know? Decentralized Finance (DeFi) Attacks";
const PAPER_AUTHORS =
  "Stefanos Chaliasos, Jens Ernstberger, David Theodore, David Wong, Mohammad Jahanara, Benjamin Livshits";
const PAPER_CITATION = [
  "@article{chaliasos2024sok,",
  "title={SoK: What don't we know? Understanding Security Vulnerabilities in SNARKs},",
  "author={Chaliasos, Stefanos and Ernstberger, Jens and Theodore, David and Wong, David and Jahanara, Mohammad and Livshits, Benjamin},",
  "journal={arXiv preprint arXiv:2402.15293},",
  "year={2024}",
  "}",
];

const ContainerStyled = styled(SmallContainer)({
  paddingTop: "2rem",
  textAlign: "center",
  "& .section": {
    paddingTop: "4rem",
    paddingBottom: "4rem",
    "&.has-top-divider": {
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        display: "block",
        height: "1px",
        background:
          "linear-gradient(to right, rgba(227,231,235,0.1) 0%, rgba(227,231,235,0.6) 50%, rgba(227,231,235,0.1) 100%)",
      },
    },
  },
  "& .hero": {
    "& > *": {
      marginTop: "2rem",
    },
  },
  "& .embed-container": {
    height: "500px",
  },
  "& .citation": {
    "& h4, h6": {
      fontWeight: 700,
    },
    "& h4": {
      marginBottom: "2rem",
    },
  },
});

function PaperPage() {
  return (
    <ContainerStyled>
      <div className="section hero">
        <div>
          <Typography variant="h3">{PAPER_SUBJECT}:</Typography>
          <Typography variant="h3">{PAPER_TITLE}</Typography>
        </div>
        <Typography variant="h6">{PAPER_AUTHORS}</Typography>
      </div>
      <div className="section has-top-divider embed-container">
        <embed src={PDF_URL} width="100%" height="100%" />
      </div>
      <div className="section has-top-divider citation">
        <Typography variant="h4">How To Cite This Dataset?</Typography>
        <Typography variant="h6">
          The original dataset can be cited using the reference provided below:
        </Typography>
        <CodeBlock>
          {PAPER_CITATION.map((row) => (
            <>
              {row}
              <br />
            </>
          ))}
        </CodeBlock>
      </div>
    </ContainerStyled>
  );
}

export default PaperPage;
