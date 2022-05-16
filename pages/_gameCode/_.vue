<script setup lang="ts">
//! This file is explicitly added to ensure gameCode is properly set for 404 page within this route.
import { PageNotFoundError } from '~/utils';

throw new PageNotFoundError();
</script>
