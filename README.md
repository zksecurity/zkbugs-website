# zkbugs website

### Original Repo
[zkbugs](https://github.com/zksecurity/zkbugs)

### 📦 Installation

#### Clone the repository and install dependencies:

```
git clone git@github.com:zksecurity/zkbugs-website.git
cd zkbugs-website
npm install  # or yarn install
```

### 🔨 Usage

#### Local Development

##### Start the development server:

`npm run dev  # or yarn dev`

#### Build

##### To create a production build:

`npm run build  # or yarn build`

#### Preview Production Build

##### Run a local server to preview the built app:

`npm run preview  # or yarn preview`

#### Tools Evaluation dataset

The `/tools-evaluation` page is backed by a pre-processed file that summarizes
the latest [zkhydra](https://github.com/zksecurity/zkhydra) run. To regenerate
it from a local zkhydra output directory:

```
python3 scripts/build_tools_evaluation.py /path/to/zkhydra/output/<run-name>
```

The script writes `public/dataset/tools-evaluation.json` and copies the three
PDF reports into `public/dataset/tools-evaluation/`.



