import axios from "axios"

const unstopSrappedJobs = async (maxJobs: number, exprience: string, role: string, jobPostedDays: string, jobType: string)=> {
    let page = 1;
    const totalJobs: any[] = [];

    const position = role.toLowerCase().replace(" ", "+"); 
    const jobTimings = jobType.toLowerCase().replace(" ", "_");

    // usertype=fresher/corporate/students
    let exprienceLevel = "";
    if (exprience !== "fresher" && exprience !== "students") {
      exprienceLevel = "corporate";
    }

    while (totalJobs.length < maxJobs) {
        const response = await axios.get(
          `https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&page=${page}&per_page=10&searchTerm=${position}&job_timing=${jobTimings}&datePosted=${jobPostedDays}&usertype=${exprienceLevel}&oppstatus=recent`
        );
    
        const jobs = response?.data?.data?.data || [];
        if (jobs.length === 0) break;
    
        const mappedJobs = jobs.map((job: any) => ({
          title: job.title,
          companyName: job.organisation?.name || "",
          description:
            job.seo_details?.[0]?.description || job.title || "No description",
    
          location: job.jobDetail?.locations?.join(", ") || "Unknown",
    
          minSalary: job.jobDetail?.show_salary
            ? String(job.jobDetail.show_salary)
            : null,
          maxSalary: job.jobDetail?.show_salary
            ? String(job.jobDetail.show_salary)
            : null,
          salary:
            job.jobDetail?.not_disclosed === false
              ? "Disclosed"
              : "Not disclosed",
    
          skills: Array.isArray(job.required_skills)
            ? job.required_skills.map((s: any) => s.skill_name)
            : [],
    
          eligibleYear: Array.isArray(job.filters)
            ? job.filters
                .filter((f: any) => f.type === "eligible")
                .map((f: any) => f.name)
                .join(", ")
            : null,
    
          requiredExp:
            job.jobDetail?.min_experience || job.jobDetail?.max_experience
              ? `${job.jobDetail?.min_experience || 0}-${job.jobDetail?.max_experience || 0} years`
              : "0 years",
    
          jobUrl: job.seo_url,
          postPlatform: "unstop",
          postedAt: new Date(job.created_at),
          experienceLevel: exprience,
          position: role
        }));
    
        totalJobs.push(...mappedJobs);
    
        if (jobs.length < 10) break;
        page++;
      }

    return totalJobs;
}



export default unstopSrappedJobs;
