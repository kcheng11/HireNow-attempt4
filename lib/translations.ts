import type { Language } from "./types"

type TranslationMap = Record<string, Record<Language, string>>

export const translations: TranslationMap = {
  // App-level
  "app.title": { en: "HireNow", hi: "हायरनाउ" },
  "app.subtitle": { en: "Connect laborers with hirers", hi: "मज़दूरों को नियोक्ताओं से जोड़ें" },
  "app.tagline": { en: "Find skilled laborers or get hired for your skills", hi: "कुशल मज़दूर खोजें या अपने कौशल के लिए काम पाएं" },

  // Roles
  "role.laborer": { en: "Laborer", hi: "मज़दूर" },
  "role.contractor": { en: "Hirer", hi: "नियोक्ता" },
  "role.laborer.desc": { en: "Find work and get hired for your skills", hi: "काम खोजें और अपने कौशल के लिए काम पाएं" },
  "role.contractor.desc": { en: "Post projects and hire skilled labor", hi: "प्रोजेक्ट पोस्ट करें और कुशल श्रम की भर्ती करें" },

  // Common
  "common.save": { en: "Save", hi: "सहेजें" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.submit": { en: "Submit", hi: "जमा करें" },
  "common.back": { en: "Back", hi: "वापस" },
  "common.next": { en: "Next", hi: "आगे" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "common.name": { en: "Name", hi: "नाम" },
  "common.phone": { en: "Phone", hi: "फ़ोन" },
  "common.location": { en: "Location", hi: "स्थान" },
  "common.all": { en: "All", hi: "सभी" },
  "common.search": { en: "Search", hi: "खोजें" },
  "common.accept": { en: "Accept", hi: "स्वीकार करें" },
  "common.decline": { en: "Decline", hi: "अस्वीकार करें" },
  "common.pending": { en: "Pending", hi: "लंबित" },
  "common.accepted": { en: "Accepted", hi: "स्वीकृत" },
  "common.declined": { en: "Declined", hi: "अस्वीकृत" },
  "common.completed": { en: "Completed", hi: "पूर्ण" },
  "common.negotiating": { en: "Negotiating", hi: "बातचीत" },
  "common.perHour": { en: "/hr", hi: "/घंटा" },
  "common.currency": { en: "₹", hi: "₹" },
  "common.switchRole": { en: "Switch Role", hi: "भूमिका बदलें" },
  "common.signBackIn": { en: "Sign back in", hi: "वापस साइन इन करें" },
  "common.existingProfiles": { en: "Existing Profiles", hi: "मौजूदा प्रोफ़ाइल" },
  "common.yes": { en: "Yes", hi: "हाँ" },
  "common.no": { en: "No", hi: "नहीं" },

  // Laborer
  "laborer.setup": { en: "Laborer Setup", hi: "मज़दूर सेटअप" },
  "laborer.skills": { en: "Skills", hi: "कौशल" },
  "laborer.addSkill": { en: "Add Skill", hi: "कौशल जोड़ें" },
  "laborer.skillName": { en: "Skill Name", hi: "कौशल का नाम" },
  "laborer.rate": { en: "Hourly Rate", hi: "प्रति घंटा दर" },
  "laborer.availability": { en: "Availability", hi: "उपलब्धता" },
  "laborer.photos": { en: "Past Project Photos", hi: "पिछली परियोजना की तस्वीरें" },
  "laborer.photoUrl": { en: "Photo URL", hi: "फोटो URL" },
  "laborer.addPhoto": { en: "Add Photo URL", hi: "फोटो URL जोड़ें" },
  "laborer.confirmPickup": { en: "Confirm Pickup Details", hi: "पिकअप विवरण की पुष्टि करें" },
  "laborer.hireRequests": { en: "Hire Requests", hi: "भर्ती अनुरोध" },
  "laborer.myCalendar": { en: "My Calendar", hi: "मेरा कैलेंडर" },
  "laborer.canDrive": { en: "Can drive themselves", hi: "खुद ड्राइव कर सकते हैं" },
  "laborer.cannotDrive": { en: "Cannot drive", hi: "ड्राइव नहीं कर सकते" },
  "laborer.canDriveQuestion": { en: "Can you drive yourself to work?", hi: "क्या आप खुद काम पर जा सकते हैं?" },
  "laborer.counterOffer": { en: "Request Different Amount", hi: "अलग राशि का अनुरोध करें" },
  "laborer.yourAmount": { en: "Your requested amount", hi: "आपकी अनुरोधित राशि" },

  // Hirer (contractor)
  "contractor.setup": { en: "Hirer Setup", hi: "नियोक्ता सेटअप" },
  "contractor.company": { en: "Company", hi: "कंपनी" },
  "contractor.projects": { en: "Projects", hi: "परियोजनाएं" },
  "contractor.createProject": { en: "Create Project", hi: "परियोजना बनाएं" },
  "contractor.browseLaborers": { en: "Browse Laborers", hi: "मज़दूर ब्राउज़ करें" },
  "contractor.projectTitle": { en: "Project Title", hi: "परियोजना शीर्षक" },
  "contractor.projectDesc": { en: "Description", hi: "विवरण" },
  "contractor.startDate": { en: "Start Date", hi: "आरंभ तिथि" },
  "contractor.endDate": { en: "End Date", hi: "समाप्ति तिथि" },
  "contractor.projectPhotos": { en: "Project Space Photos", hi: "प्रोजेक्ट स्थान की तस्वीरें" },
  "contractor.addPhotoUrl": { en: "Add Photo URL", hi: "फोटो URL जोड़ें" },

  // Browse
  "browse.title": { en: "Browse Laborers", hi: "मज़दूर ब्राउज़ करें" },
  "browse.filterSkill": { en: "Filter by Skill", hi: "कौशल द्वारा फ़िल्टर" },
  "browse.filterLocation": { en: "Filter by Location", hi: "स्थान द्वारा फ़िल्टर" },
  "browse.filterDay": { en: "Filter by Day", hi: "दिन द्वारा फ़िल्टर" },
  "browse.sortRate": { en: "Sort by Rate", hi: "दर के अनुसार क्रमबद्ध" },
  "browse.lowToHigh": { en: "Low to High", hi: "कम से अधिक" },
  "browse.highToLow": { en: "High to Low", hi: "अधिक से कम" },
  "browse.requestHire": { en: "Request to Hire", hi: "भर्ती का अनुरोध" },
  "browse.selectProject": { en: "Select Project", hi: "परियोजना चुनें" },
  "browse.selectDate": { en: "Select Date", hi: "तिथि चुनें" },
  "browse.pickupLocation": { en: "Pickup Location", hi: "पिकअप स्थान" },
  "browse.dropoffLocation": { en: "Dropoff Location", hi: "ड्रॉपऑफ़ स्थान" },
  "browse.offeredAmount": { en: "Offered Amount (₹)", hi: "प्रस्तावित राशि (₹)" },
  "browse.sendRequest": { en: "Send Request", hi: "अनुरोध भेजें" },

  // Project
  "project.detail": { en: "Project Detail", hi: "परियोजना विवरण" },
  "project.hiredLaborers": { en: "Hired Laborers", hi: "भर्ती किए गए मज़दूर" },
  "project.rateLaborer": { en: "Rate Laborer", hi: "मज़दूर को रेट करें" },
  "project.stars": { en: "Stars", hi: "सितारे" },
  "project.comment": { en: "Comment", hi: "टिप्पणी" },
  "project.jobCompleted": { en: "Job Completed?", hi: "काम पूरा हुआ?" },
  "project.paymentReceived": { en: "Payment Received", hi: "भुगतान प्राप्त हुआ" },
  "project.approveAmount": { en: "Approve", hi: "स्वीकृत करें" },
  "project.denyAmount": { en: "Deny", hi: "अस्वीकार करें" },
  "project.amendAmount": { en: "Amend Amount", hi: "राशि संशोधित करें" },
  "project.newAmount": { en: "New Amount", hi: "नई राशि" },
  "project.counterOffer": { en: "Counter Offer", hi: "प्रति-प्रस्ताव" },

  // Days
  "day.monday": { en: "Monday", hi: "सोमवार" },
  "day.tuesday": { en: "Tuesday", hi: "मंगलवार" },
  "day.wednesday": { en: "Wednesday", hi: "बुधवार" },
  "day.thursday": { en: "Thursday", hi: "गुरुवार" },
  "day.friday": { en: "Friday", hi: "शुक्रवार" },
  "day.saturday": { en: "Saturday", hi: "शनिवार" },
  "day.sunday": { en: "Sunday", hi: "रविवार" },

  // Skills
  "skill.plumbing": { en: "Plumbing", hi: "प्लम्बिंग" },
  "skill.electrical": { en: "Electrical", hi: "इलेक्ट्रिकल" },
  "skill.carpentry": { en: "Carpentry", hi: "बढ़ईगीरी" },
  "skill.painting": { en: "Painting", hi: "पेंटिंग" },
  "skill.masonry": { en: "Masonry", hi: "चिनाई" },
  "skill.welding": { en: "Welding", hi: "वेल्डिंग" },
  "skill.tiling": { en: "Tiling", hi: "टाइलिंग" },
  "skill.roofing": { en: "Roofing", hi: "छत" },
  "skill.labor": { en: "General Labor", hi: "सामान्य श्रम" },
}

export function getTranslation(key: string, language: Language): string {
  return translations[key]?.[language] ?? key
}
