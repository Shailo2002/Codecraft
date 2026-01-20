import { showCaseProjects } from "../constants/showCaseProjects";
import PricingDisplay from "./PricingSection";
import { ShowcaseCard } from "./ShowcaseCardProps";

function ShowCase() {
  return (
    <div className="block">
      {/* project showcase */}
      <div className="bg-neutral-950 p-8" id="Templates">
        <div className="p-4">
          <h1 className="text-lg text-center md:text-xl tracking-tight">
            ShowCase
          </h1>
        </div>

        <div className="p-4 flex flex-wrap justify-center gap-8">
          {showCaseProjects.map((project, index) => (
            <div className="w-84" key={index}>
              <ShowcaseCard
                title={project?.title}
                link={project?.link}
                previewImage={project?.previewImage}
                websitePrompt={project?.website_prompt}
              />
            </div>
          ))}
        </div>
      </div>

      {/* pricing */}
      <PricingDisplay />
    </div>
  );
}

export default ShowCase;
