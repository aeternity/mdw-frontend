<script>
export default {
  fetch ({ params, redirect }) {
    redirect(301, `/account/${params.id}`)
  }
}
</script>
