import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Link as RouterLink,
  useParams,
} from "react-router";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Check,
  ContentCopy,
  Clear,
  ExpandLess,
  ExpandMore,
  OpenInNew,
} from "@mui/icons-material";
import Container from "../../components/layout/Container";
import CodeFromUrl from "../../components/code-from-url/CodeFromUrl";
import CodeSnippet from "../../components/code-snippet/CodeSnippet";
import { useBug } from "../../hooks/useBug";
import { useReports } from "../../hooks/useReports";
import { bugPath, paths, reportPath } from "../../utils/paths";
import { getTrimmedPathFromUrl } from "../../utils/transformations";

const ZKBUGS_TREE_BASE = "https://github.com/zksecurity/zkbugs/tree/main/";
const ZKBUGS_BLOB_BASE = "https://github.com/zksecurity/zkbugs/blob/main/";
const ZKBUGS_RAW_BASE = "https://raw.githubusercontent.com/zksecurity/zkbugs/main/";
const GITHUB_PREFIX = "https://github.com/";
const GITHUB_RAW_PREFIX = "https://raw.githubusercontent.com/";

const PageWrapperStyled = styled("div")({
  margin: "3rem 0 4rem",
});

const SectionStyled = styled("section")({
  marginTop: "2.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  "& .section-title": {
    fontWeight: 600,
  },
});

const CardStyled = styled(Paper)(({ theme }) => ({
  padding: "1.25rem 1.5rem",
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.5rem",
}));

const InlineCodeStyled = styled("code")(({ theme }) => ({
  fontFamily: "Roboto Mono, monospace",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.borders.default}`,
  borderRadius: "0.25rem",
  padding: "0.05rem 0.35rem",
  fontSize: "0.92em",
}));

const MetaGridStyled = styled("dl")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  rowGap: "0.6rem",
  columnGap: "1rem",
  margin: 0,
  "& dt": {
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  "& dd": {
    margin: 0,
    wordBreak: "break-word",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    rowGap: "0.25rem",
    "& dd": { marginBottom: "0.5rem" },
  },
}));

const StatusPill = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.3rem 0.65rem",
  borderRadius: "999px",
  border: `1px solid ${theme.palette.borders.default}`,
  fontSize: "0.82rem",
  color: theme.palette.text.secondary,
}));

const renderInlineMarkup = (text) => {
  if (!text) return null;
  const parts = String(text).split("`");
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <InlineCodeStyled key={index}>{part}</InlineCodeStyled>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
};

const shortHash = (hash) => {
  if (!hash) return "";
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;
  return clean.length > 10 ? clean.slice(0, 10) : clean;
};

const StatusBadge = ({ label, value }) => (
  <StatusPill>
    {value ? (
      <Check color="success" sx={{ fontSize: 16 }} />
    ) : (
      <Clear color="error" sx={{ fontSize: 16 }} />
    )}
    <span>{label}</span>
  </StatusPill>
);

StatusBadge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
};

const CopyButton = ({ value }) => (
  <Tooltip title="Copy">
    <IconButton
      size="small"
      onClick={() => navigator.clipboard?.writeText(value)}
    >
      <ContentCopy sx={{ fontSize: 14 }} />
    </IconButton>
  </Tooltip>
);

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
};

const cleanCommitHash = (hash) =>
  hash?.startsWith("0x") ? hash.slice(2) : hash;

const getProjectSlug = (projectUrl) => {
  if (!projectUrl) return null;
  if (!projectUrl.startsWith(GITHUB_PREFIX)) return null;
  return projectUrl.slice(GITHUB_PREFIX.length).replace(/\/$/, "");
};

const buildProjectFileUrl = (bug, filePath) => {
  if (!bug?.project || !bug?.commit || !filePath) return null;
  const projectBase = bug.project.replace(/\/$/, "");
  const cleanPath = filePath.replace(/^\/+/, "");
  return `${projectBase}/blob/${cleanCommitHash(bug.commit)}/${cleanPath}`;
};

const buildProjectTreeUrl = (bug) => {
  if (!bug?.project || !bug?.commit) return null;
  const projectBase = bug.project.replace(/\/$/, "");
  return `${projectBase}/tree/${cleanCommitHash(bug.commit)}`;
};

const buildProjectRawUrl = (bug, filePath) => {
  const slug = getProjectSlug(bug?.project);
  if (!slug || !bug?.commit || !filePath) return null;
  const cleanPath = filePath.replace(/^\/+/, "");
  return `${GITHUB_RAW_PREFIX}${slug}/${cleanCommitHash(bug.commit)}/${cleanPath}`;
};

const parseLineRange = (lineStr) => {
  if (!lineStr) return null;
  const nums = String(lineStr).match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  const numbers = nums.map(Number).filter((n) => Number.isFinite(n));
  if (numbers.length === 0) return null;
  return { start: Math.min(...numbers), end: Math.max(...numbers) };
};

function NotFound() {
  return (
    <Container>
      <PageWrapperStyled>
        <CardStyled elevation={0} sx={{ padding: "2rem 2.5rem" }}>
          <Typography variant="h4" gutterBottom>
            Bug not found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: "1.5rem" }}
          >
            This bug ID is not in the current dataset. It may have been removed
            or the link may be stale.
          </Typography>
          <Button
            component={RouterLink}
            to={paths.home}
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBack fontSize="small" />}
          >
            Back to all bugs
          </Button>
        </CardStyled>
      </PageWrapperStyled>
    </Container>
  );
}

function LoadingState() {
  return (
    <Container>
      <PageWrapperStyled>
        <Typography variant="body1">Loading bug…</Typography>
      </PageWrapperStyled>
    </Container>
  );
}

function BugPage() {
  const { bugId } = useParams();
  const { bug, similar, loading } = useBug(bugId);
  const reports = useReports();
  const [showLocationCode, setShowLocationCode] = useState(false);

  useEffect(() => {
    if (bug?.title) {
      document.title = `${bug.title} · zkbugs`;
      return () => {
        document.title = "zkbugs";
      };
    }
    return undefined;
  }, [bug?.title]);

  if (loading) return <LoadingState />;
  if (!bug) return <NotFound />;

  const {
    title,
    dsl,
    vulnerability,
    impact,
    rootCause,
    project,
    commit,
    fixCommit,
    location,
    source,
    codebase,
    directEntrypoint,
    originalEntrypoint,
    input,
    path,
    shortDescriptionOfTheVulnerability,
    proposedMitigation,
    reproduced,
    executed,
    compiledDirect,
    compiledOriginal,
  } = bug;

  const zkbugsDirUrl = path ? ZKBUGS_TREE_BASE + path : null;
  const codebaseUpstreamUrl = buildProjectTreeUrl(bug);
  const projectSlug = getProjectSlug(project);

  const directEntryPath = path && directEntrypoint
    ? `${path}/${directEntrypoint}`
    : null;
  const directEntryBlobUrl = directEntryPath
    ? ZKBUGS_BLOB_BASE + directEntryPath
    : null;

  const directInputPath = path && input?.direct ? `${path}/${input.direct}` : null;
  const directInputRawUrl = directInputPath
    ? ZKBUGS_RAW_BASE + directInputPath
    : null;
  const directInputBlobUrl = directInputPath
    ? ZKBUGS_BLOB_BASE + directInputPath
    : null;

  const locationProjectUrl = buildProjectFileUrl(bug, location?.path);
  const locationRawUrl = buildProjectRawUrl(bug, location?.path);
  const locationLineRange = parseLineRange(location?.line);

  const matchedReport = (() => {
    const link = source?.sourceLink;
    if (!link || !reports.length) return null;
    const basename = link.split("/").pop();
    if (!basename) return null;
    return (
      reports.find((r) => {
        const f = r.file?.split("/").pop();
        return f && f === basename;
      }) ?? null
    );
  })();

  return (
    <Container>
      <PageWrapperStyled>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Button
              component={RouterLink}
              to={paths.home}
              size="small"
              variant="text"
              color="secondary"
              startIcon={<ArrowBack fontSize="small" />}
              sx={{ marginLeft: "-0.5rem", textTransform: "none" }}
            >
              All bugs
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 600, marginTop: "0.25rem" }}>
              {title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ marginTop: "0.75rem", flexWrap: "wrap", rowGap: "0.5rem" }}>
              {dsl && <Chip size="small" label={dsl} color="secondary" variant="outlined" />}
              {vulnerability && (
                <Chip size="small" label={vulnerability} variant="outlined" />
              )}
              {impact && <Chip size="small" label={impact} variant="outlined" />}
              {rootCause && (
                <Chip size="small" label={rootCause} variant="outlined" />
              )}
            </Stack>
          </div>
          {zkbugsDirUrl && (
            <Button
              component="a"
              href={zkbugsDirUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="secondary"
              startIcon={<OpenInNew fontSize="small" />}
            >
              View on GitHub
            </Button>
          )}
        </Box>

        <SectionStyled>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: "0.5rem" }}>
            <StatusBadge label="Reproduced" value={!!reproduced} />
            <StatusBadge label="Executed" value={!!executed} />
            <StatusBadge label="Compiled (Direct)" value={!!compiledDirect} />
            <StatusBadge label="Compiled (Original)" value={!!compiledOriginal} />
          </Stack>
        </SectionStyled>

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Metadata
          </Typography>
          <CardStyled elevation={0}>
            <MetaGridStyled>
              {dsl && (
                <>
                  <dt>DSL</dt>
                  <dd>{dsl}</dd>
                </>
              )}
              {vulnerability && (
                <>
                  <dt>Vulnerability</dt>
                  <dd>{vulnerability}</dd>
                </>
              )}
              {impact && (
                <>
                  <dt>Impact</dt>
                  <dd>{impact}</dd>
                </>
              )}
              {rootCause && (
                <>
                  <dt>Root Cause</dt>
                  <dd>{rootCause}</dd>
                </>
              )}
              {project && (
                <>
                  <dt>Project</dt>
                  <dd>
                    <Link href={project} target="_blank" rel="noopener noreferrer">
                      {getTrimmedPathFromUrl(project)}
                    </Link>
                  </dd>
                </>
              )}
              {commit && (
                <>
                  <dt>Commit</dt>
                  <dd>
                    <InlineCodeStyled>{shortHash(commit)}</InlineCodeStyled>{" "}
                    <CopyButton value={commit} />
                  </dd>
                </>
              )}
              {fixCommit && (
                <>
                  <dt>Fix Commit</dt>
                  <dd>
                    <InlineCodeStyled>{shortHash(fixCommit)}</InlineCodeStyled>{" "}
                    <CopyButton value={fixCommit} />
                  </dd>
                </>
              )}
              {(location?.path || location?.function || location?.line) && (
                <>
                  <dt>Location</dt>
                  <dd>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                      }}
                    >
                      {locationProjectUrl ? (
                        <Link
                          href={locationProjectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InlineCodeStyled>{location.path}</InlineCodeStyled>
                        </Link>
                      ) : (
                        location.path && (
                          <InlineCodeStyled>{location.path}</InlineCodeStyled>
                        )
                      )}
                      {location.function && (
                        <>
                          <span>·</span>
                          <InlineCodeStyled>{location.function}</InlineCodeStyled>
                        </>
                      )}
                      {location.line && (
                        <>
                          <span>·</span>
                          <span>L{location.line}</span>
                        </>
                      )}
                      {locationRawUrl && (
                        <Button
                          size="small"
                          variant="text"
                          color="secondary"
                          onClick={() => setShowLocationCode((v) => !v)}
                          endIcon={
                            showLocationCode ? (
                              <ExpandLess fontSize="small" />
                            ) : (
                              <ExpandMore fontSize="small" />
                            )
                          }
                          sx={{ marginLeft: "0.25rem", textTransform: "none" }}
                        >
                          {showLocationCode ? "Hide code" : "Show code"}
                        </Button>
                      )}
                    </Box>
                  </dd>
                </>
              )}
              {source?.sourceLink && (
                <>
                  <dt>Source</dt>
                  <dd>
                    {matchedReport ? (
                      <Link
                        component={RouterLink}
                        to={reportPath(matchedReport.id)}
                      >
                        {source.variantName || "Report"}
                        {source.bugId ? ` — ${source.bugId}` : ""}
                      </Link>
                    ) : (
                      <Link
                        href={source.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.variantName || "Report"}
                        {source.bugId ? ` — ${source.bugId}` : ""}
                      </Link>
                    )}
                  </dd>
                </>
              )}
            </MetaGridStyled>
          </CardStyled>
          {showLocationCode && locationRawUrl && (
            <Box sx={{ marginTop: "0.75rem" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <InlineCodeStyled>{location.path}</InlineCodeStyled>
                  {location.line ? ` · lines ${location.line}` : null}
                </Typography>
                {locationProjectUrl && (
                  <Link
                    href={locationProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                  >
                    Open on GitHub
                  </Link>
                )}
              </Box>
              <CodeSnippet
                url={locationRawUrl}
                startLine={locationLineRange?.start}
                endLine={locationLineRange?.end}
                contextLines={15}
                language={dsl === "Circom" ? "circom" : "plain"}
              />
            </Box>
          )}
        </SectionStyled>

        {shortDescriptionOfTheVulnerability && (
          <SectionStyled>
            <Typography variant="h6" className="section-title">
              Vulnerability
            </Typography>
            <CardStyled elevation={0}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {renderInlineMarkup(shortDescriptionOfTheVulnerability)}
              </Typography>
            </CardStyled>
          </SectionStyled>
        )}

        {proposedMitigation && (
          <SectionStyled>
            <Typography variant="h6" className="section-title">
              Proposed Mitigation
            </Typography>
            <CardStyled elevation={0}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {renderInlineMarkup(proposedMitigation)}
              </Typography>
            </CardStyled>
          </SectionStyled>
        )}

        {codebase && (
          <SectionStyled>
            <Typography variant="h6" className="section-title">
              Artifacts
            </Typography>
            <CardStyled elevation={0}>
              <MetaGridStyled>
                <dt>Codebase</dt>
                <dd>
                  {codebaseUpstreamUrl ? (
                    <Link
                      href={codebaseUpstreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {projectSlug ? (
                        <>
                          <InlineCodeStyled>{projectSlug}</InlineCodeStyled>{" "}
                          @ <InlineCodeStyled>{shortHash(commit)}</InlineCodeStyled>
                        </>
                      ) : (
                        <InlineCodeStyled>{shortHash(commit)}</InlineCodeStyled>
                      )}
                    </Link>
                  ) : (
                    <InlineCodeStyled>{codebase}</InlineCodeStyled>
                  )}
                </dd>
                {directEntrypoint && (
                  <>
                    <dt>Direct Entrypoint</dt>
                    <dd>
                      {directEntryBlobUrl ? (
                        <Link
                          href={directEntryBlobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InlineCodeStyled>{directEntrypoint}</InlineCodeStyled>
                        </Link>
                      ) : (
                        <InlineCodeStyled>{directEntrypoint}</InlineCodeStyled>
                      )}
                    </dd>
                  </>
                )}
                {Array.isArray(originalEntrypoint) && originalEntrypoint.length > 0 && (
                  <>
                    <dt>Original Entrypoint{originalEntrypoint.length > 1 ? "s" : ""}</dt>
                    <dd>
                      <Stack spacing={0.5}>
                        {originalEntrypoint.map((entry) => {
                          const url = buildProjectFileUrl(bug, entry);
                          return (
                            <span key={entry}>
                              {url ? (
                                <Link
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <InlineCodeStyled>{entry}</InlineCodeStyled>
                                </Link>
                              ) : (
                                <InlineCodeStyled>{entry}</InlineCodeStyled>
                              )}
                            </span>
                          );
                        })}
                      </Stack>
                    </dd>
                  </>
                )}
              </MetaGridStyled>
            </CardStyled>

            {directInputRawUrl && (
              <Box sx={{ marginTop: "1rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    <InlineCodeStyled>{input.direct}</InlineCodeStyled>
                  </Typography>
                  {directInputBlobUrl && (
                    <Link
                      href={directInputBlobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                    >
                      Open on GitHub
                    </Link>
                  )}
                </Box>
                <CodeFromUrl url={directInputRawUrl} />
              </Box>
            )}
          </SectionStyled>
        )}

        <SectionStyled>
          <Typography variant="h6" className="section-title">
            Similar Bugs
          </Typography>
          {similar.length === 0 ? (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No similar bugs recorded.
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: "0.5rem" }}>
              {similar.map((item) => {
                const known = item.dsl !== null;
                return (
                  <Chip
                    key={item.id}
                    label={item.title}
                    variant="outlined"
                    clickable={known}
                    component={known ? RouterLink : "span"}
                    to={known ? bugPath(item.id) : undefined}
                    sx={{
                      maxWidth: 360,
                      height: "auto",
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                        lineHeight: 1.3,
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      },
                    }}
                  />
                );
              })}
            </Stack>
          )}
        </SectionStyled>

      </PageWrapperStyled>
    </Container>
  );
}

export default BugPage;
