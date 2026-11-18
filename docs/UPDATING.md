# Updating the Lanevia site (no code needed)

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the Lanevia repository.
3. Pick a form in the left sidebar:

| Form | What it changes |
| --- | --- |
| Site settings | Company name, contact email, the announcement strip at the top, the class-project disclaimer |
| Home page | Headline, intro, buttons, the dark fact band, the six feature cards |
| How it works page | The five steps, data levels table, privacy commitments |
| For data buyers page | Buyer types, launch phases, the bottom call to action |
| Demo data: road events | Rows in the road events tables |
| Demo data: buyer feed | Rows in the buyer feed table |

4. Edit, then click **Save**. The site rebuilds automatically and is live in about 2 minutes.

## Rules

- Lists can be dragged to reorder. Order in the form is the order on the site.
- Links to our own pages start with `/`, for example `/buyers/`.
- Keep the class-project disclaimer.
- Don't add testimonials, reviews or quotes from people.
- Never add customer, device or clip IDs to the buyer feed. The build will refuse to publish if you do.
- If a save doesn't show up after 5 minutes, check the **Actions** tab on GitHub. A red X usually means a required field was left empty, and the error message names it.
