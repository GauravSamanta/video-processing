import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/upload')({
  component: Upload,
})

function Upload() {
  return (
    <div>
      <h2>Upload a Video</h2>
      <form action="/upload" method="POST" encType="multipart/form-data">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required />
        <br />

        <label htmlFor="video">Upload Video:</label>
        <input type="file" id="video" name="video" accept="video/*" required />
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
