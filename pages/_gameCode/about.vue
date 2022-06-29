<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { inject, useMeta as useHead, Ref } from '@nuxtjs/composition-api';
import { useI18n } from 'nuxt-i18n-composable';
import useGameInfo from '~/composables/useGameInfo';

const isDarkMode: Ref<boolean> = inject('isDarkMode')!;

const i18n = useI18n();
const { gameCode } = useGameInfo();

useHead(() => ({
  title: i18n.t('page-title.about') as string,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'AboutPage',
  head: {},
});
</script>

<template>
  <!-- eslint-disable max-len -->
  <v-container class="pa-8">
    <h1>{{ $t('page-title.about') }}</h1>

    <v-divider class="my-3" />

    <h3>{{ $t('page.about.author') }}</h3>
    <ul>
      <li>
        <a class="text-decoration-none" href="https://github.com/zetaraku" target="_blank">
          <v-icon small left color="#24292e">mdi-github</v-icon><span>zetaraku (Raku Zeta)</span>
        </a>
      </li>
      <li>
        <a class="text-decoration-none" href="https://reddit.com/u/zetaraku" target="_blank">
          <v-icon small left color="#ff4500">mdi-reddit</v-icon><span>u/zetaraku</span>
        </a>
      </li>
      <li>
        <a class="text-decoration-none" href="https://twitter.com/zetaraku" target="_blank">
          <v-icon small left color="#1da1f2">mdi-twitter</v-icon><span>@zetaraku</span>
        </a>
      </li>
    </ul>

    <br>

    <h3>{{ $t('page.about.dataSource') }}</h3>
    <ul>
      <template v-if="gameCode === 'maimai'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://maimai.sega.jp/" target="_blank">maimai でらっくす UNiVERSE PLUS公式サイト｜セガ音ゲー</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="http://maimai.wiki.fc2.com/" target="_blank">maimai wiki</a>
          (<a href="https://web.archive.org/web/20220327004356/https://maimai.wiki.fc2.com/" target="_blank">archive</a>)
          /
          <a href="https://maimai.gamerch.com/" target="_blank">maimai 攻略wiki - Gamerch</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
        <li>
          {{ $t('term.internalLevel') }} －
          <a class="text-decoration-none" href="https://twitter.com/rcmf_maimai" target="_blank">
            <v-icon small left color="#1da1f2">mdi-twitter</v-icon><span>maimai譜面定数メインフレーム</span>
          </a> <i>(Thanks <a href="https://twitter.com/rcmf_maimai" target="_blank">@RCMF_maimai</a> !)</i>
        </li>
        <li>
          中国版 (舞萌DX) {{ $t('page.about.sheetInfo') }} －
          <a class="text-decoration-none" href="https://github.com/CrazyKidCN/maimaiDX-CN-songs-database" target="_blank">
            <v-icon small left color="#24292e">mdi-github</v-icon><span>CrazyKidCN/maimaiDX-CN-songs-database</span>
          </a> <i>(Thanks <a href="https://github.com/CrazyKidCN" target="_blank">@CrazyKidCN</a> !)</i>
        </li>
      </template>
      <template v-if="gameCode === 'wacca'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://wacca.marv.jp/" target="_blank">「WACCA Reverse」公式Webサイト │ さあ、ぼくと遊ぼうか</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://wacca.gamerch.com/" target="_blank">WACCA 攻略wiki</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'chunithm'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://chunithm.sega.jp/" target="_blank">CHUNITHM NEW PLUS (チュウニズム ニュー プラス)｜セガ新作音ゲー</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://chunithm.gamerch.com/" target="_blank">CHUNITHM【チュウニズム】攻略wiki</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'sdvx'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://p.eagate.573.jp/game/sdvx/vi/" target="_blank">SOUND VOLTEX EXCEED GEAR</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://w.atwiki.jp/sdvx/" target="_blank">SOUND VOLTEX @ wiki | サウンドボルテックス - atwiki（アットウィキ）</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'jubeat'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://p.eagate.573.jp/game/jubeat/festo/top/" target="_blank">jubeat festo</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://w.atwiki.jp/jubeat/" target="_blank">jubeat@Wiki - atwiki（アットウィキ）</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'taiko'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://taiko.namco-ch.net/taiko/" target="_blank">太鼓の達人（ゲームセンター向け） | バンダイナムコアミューズメント</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://www.wikihouse.com/taiko/" target="_blank">FrontPage - 太鼓の達人 譜面とかWiki</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'ongeki'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://ongeki.sega.jp/" target="_blank">オンゲキ bright MEMORY公式サイト｜セガ新作音ゲー</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://ongeki.gamerch.com/" target="_blank">オンゲキ【音撃‐O.N.G.E.K.I-】攻略wiki - Gamerch</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'gc'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://groovecoaster.jp/" target="_blank">グルーヴコースター 4MAX ダイヤモンドギャラクシー（アーケード版）GROOVE COASTER 4MAX DIAMOND GALAXY - 公式サイト</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://www.wikihouse.com/groove/" target="_blank">FrontPage - グルーヴコースター Wiki</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
      <template v-if="gameCode === 'diva'">
        <li>
          {{ $t('page.about.songInfo') }} －
          <a href="https://miku.sega.jp/arcade/" target="_blank">初音ミク Project DIVA Arcade Future Tone 公式サイト</a>
        </li>
        <li>
          {{ $t('page.about.sheetInfo') }} －
          <a href="https://w.atwiki.jp/projectdiva_ac/" target="_blank">Project DIVA Arcade @ wiki - atwiki（アットウィキ）</a>
          － {{ $t('page.about.sheetInfoDescription') }}
        </li>
      </template>
    </ul>

    <br>

    <h3>{{ $t('page.about.openSource') }}</h3>
    <ul>
      <li>
        <a class="text-decoration-none" href="https://github.com/zetaraku/arcade-songs" target="_blank">
          <v-icon small left color="#24292e">mdi-github</v-icon><span>zetaraku/arcade-songs</span>
        </a>
        <!-- eslint-disable-next-line vue/no-v-html -->
        － <span v-html="$t('page.about.openSourceDescription')" />
      </li>
      <li>
        <a class="text-decoration-none" href="https://github.com/zetaraku/arcade-songs-fetch" target="_blank">
          <v-icon small left color="#24292e">mdi-github</v-icon><span>zetaraku/arcade-songs-fetch</span>
        </a>
        － <span><u>arcade-songs-fetch</u> is the data-fetching scripts used by <u>arcade-songs</u>, also licensed in MIT. ⭐</span>
      </li>
    </ul>

    <br>

    <h3>{{ $t('page.about.updateRecord') }}</h3>
    <v-timeline dense align-top class="mt-2">
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/06/29 － v2.14.1 Update</span>
        <ul>
          <li>misc: (Data) adapt .webp format for cover images to speed up the loading time 🚅⚡</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-flag-variant">
        <span class="font-weight-bold">2022/06/24 － 30000 visits reached</span>
        <ul>
          <li>
            milestone: 30000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2022/06/12 － v2.14 Update</span>
        <ul>
          <li>feature: (Data) add sheet internal level information (maimai)</li>
          <li>
            Data source:
            <a class="text-decoration-none" href="https://twitter.com/rcmf_maimai" target="_blank">
              <v-icon small left color="#1da1f2">mdi-twitter</v-icon><span>maimai譜面定数メインフレーム</span>
            </a> <i>(Thanks <a href="https://twitter.com/rcmf_maimai" target="_blank">@RCMF_maimai</a> !)</i>
          </li>
          <li>misc: (Data) now each song will have an unique id</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2022/04/24 － v2.13 Update</span>
        <ul>
          <li>feature: (Song List) add Song List page</li>
          <li>feature: (Song Page) add Song pages for each song</li>
          <li>misc: (Track List) rename "Gallery" as "Track List"</li>
          <li>misc: (Filter) buttons on app bar are now moved to side drawer</li>
          <li>misc: (Portal) Portal Dialog is now moved to a dedicated page</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2022/04/12 － v2.12 Update</span>
        <ul>
          <li>misc: (Data) use new version of data source</li>
          <li>misc: (Data) display min/max bpm on filter placeholder</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-flag-variant">
        <span class="font-weight-bold">2022/03/17 － 20000 visits reached</span>
        <ul>
          <li>
            milestone: 20000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/03/04 － v2.11.3 Update</span>
        <ul>
          <li>bugfix: (Data) chunithm data is now up to date</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/02/14 － v2.11.2 Update</span>
        <ul>
          <li>ui: (Grid View / Gallery) adjust text alignment</li>
          <li>misc: (Site) improve loading speed</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/01/30 － v2.11.1 Update</span>
        <ul>
          <li>i18n: (Site) add zh-Hans (zh-CN) locale</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2022/01/29 － v2.11 Update</span>
        <ul>
          <li>feature: (Data) add song list info for China version (舞萌DX)</li>
          <li>feature: (Filter) region filter "China ver. (舞萌DX)" is now available</li>
          <li>
            Data source:
            <a class="text-decoration-none" href="https://github.com/CrazyKidCN/maimaiDX-CN-songs-database" target="_blank">
              <v-icon small left color="#24292e">mdi-github</v-icon><span>CrazyKidCN/maimaiDX-CN-songs-database</span>
            </a> <i>(Thanks <a href="https://github.com/CrazyKidCN" target="_blank">@CrazyKidCN</a> !)</i>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/01/17 － v2.10.1 Update</span>
        <ul>
          <li>misc: (Grid View) prevent sprite sheet image to be selected on mobile devices</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2022/01/11 － v2.10 Update</span>
        <ul>
          <li>feature: (Random Set) now you can draw a set of sheets in Random Set mode!</li>
          <li>misc: (My List) use dummy sheets to represent unmatched sheets from importing</li>
          <li>misc: (Grid View) fix potential id duplication bug</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2022/01/05 － v2.9.1 Update</span>
        <ul>
          <li>misc: (Filter) filters of title and artist are now case-insensitive</li>
          <li>misc: (Filter) My List switch is now changed to radio</li>
          <li>misc: (Sheet Dialog) cover image of songs can now be easily saved</li>
          <li>misc: (Grid View) sheet grids should now perfectly aligned</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-flag-variant">
        <span class="font-weight-bold">2021/09/29 － 10000 visits reached</span>
        <ul>
          <li>
            milestone: 10000 visits reached on <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>!
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/09/21 － v2.9 Update</span>
        <ul>
          <li>
            project: add new site for <strong>Project DIVA Arcade</strong>
            >> <a href="https://diva-songs.zetaraku.dev/" target="_blank">diva-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/08/24 － v2.8.1 Update</span>
        <ul>
          <li>bugfix: (Data) handle null category (jubeat)</li>
          <li>misc: (Site) change main theme color for jubeat-songs and gc-songs</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/08/23 － v2.8 Update</span>
        <ul>
          <li>
            project: add new site for <strong>GROOVE COASTER</strong>
            >> <a href="https://gc-songs.zetaraku.dev/" target="_blank">gc-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/08/20 － v2.7.1 Update</span>
        <ul>
          <li>misc: (Site) change logo and favicons</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/08/20 － v2.7 Update</span>
        <ul>
          <li>
            project: add new site for <strong>オンゲキ</strong>
            >> <a href="https://ongeki-songs.zetaraku.dev/" target="_blank">ongeki-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2021/08/20 － v2.6 Update</span>
        <ul>
          <li>feature: (Song List) re-add "Gallery" as "Song List"</li>
          <li>feature: (My List) now you can import/export sheets in My List</li>
          <li>misc: (Data) maimai: region-only songs are manually added</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/06/21 － v2.5.5 Update</span>
        <ul>
          <li>ui: (List View / Sheet Dialog) now locked songs will have a locked icon</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/05/25 － v2.5.4 Update</span>
        <ul>
          <li>bugfix: (Grid View) scaling on hover now works on non-Firefox browsers too</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/05/16 － v2.5.3 Update</span>
        <ul>
          <li>project: update of <a href="https://sdvx-songs.zetaraku.dev" target="_blank">sdvx-songs</a> is now started again! :D</li>
          <li>misc: (Data) now songs can have multiple categories (used by <u>sdvx-songs</u>)</li>
          <li>misc: (Site) track more interaction event for development insight &gt;:)</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/03/18 － v2.5.2 Update</span>
        <ul>
          <li>misc: (Filter) now display how many songs are included in the current selection</li>
          <li>bugfix: (Grid View) fix the excessive white border on the cover images</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/03/10 － v2.5.1 Update</span>
        <ul>
          <li>bugfix: (Grid View) fix the broken light bulb 💡 in DARK MODE</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/02/03 － v2.5 Update</span>
        <ul>
          <li>
            project: add new site for <strong>太鼓の達人</strong>
            >> <a href="https://taiko-songs.zetaraku.dev" target="_blank">taiko-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2021/01/31 － v2.4 Update</span>
        <ul>
          <li>feature: (Site / Filter) now you can copy and use a Filter Link</li>
          <li>feature: (Sheet Dialog) now you can click on the title to copy it</li>
          <li>ui: (Grid View) add second pagination</li>
          <li>misc: (Grid View) now the default sorting is ordered by version then release date</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/01/22 － v2.3 Update</span>
        <ul>
          <li>
            project: add new site for <strong>jubeat</strong>
            >> <a href="https://jubeat-songs.zetaraku.dev" target="_blank">jubeat-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-star">
        <span class="font-weight-bold">2021/01/20 － v2.2 Update</span>
        <ul>
          <li>
            project: add new site for <strong>SOUND VOLTEX</strong>
            >> <a href="https://sdvx-songs.zetaraku.dev" target="_blank">sdvx-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2021/01/15 － v2.1.1 Update</span>
        <ul>
          <li>ui: (Filter) make multiple selectable chips individually removable</li>
          <li>ui: (Filter) prevent comboboxes from being obstructed by the autocomplete list</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2021/01/11 － v2.1 Update</span>
        <ul>
          <li>feature: (Data) add "WORLD'S END" sheets for CHUNITHM</li>
          <li>feature: (Site) add "Portal"</li>
          <li>feature: (Site) remove "Gallery"</li>
          <li>ui: (Grid View) fix img tag display problem (extra space)</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item large icon="mdi-star">
        <span class="font-weight-bold">2021/01/01 － v2.0.21 United</span>
        <ul>
          <li><i>HAPPY NEW YEAR <del>2020</del> 2021!</i></li>
          <li>
            project: <u>mai-songs</u> is now moved to >> <a href="https://maimai-songs.zetaraku.dev" target="_blank">maimai-songs</a>
          </li>
          <li>
            project: add new site for <strong>WACCA</strong>
            >> <a href="https://wacca-songs.zetaraku.dev" target="_blank">wacca-songs</a>
          </li>
          <li>
            project: add new site for <strong>CHUNITHM</strong>
            >> <a href="https://chunithm-songs.zetaraku.dev" target="_blank">chunithm-songs</a>
          </li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2020/12/31 － v1.9.9 Update</span>
        <ul>
          <li>ui: (Sheet Dialog) add release date and version info</li>
          <li>misc: (Site) add Open Graph meta tags for social media preview</li>
          <li>misc: (Data) enable asset compression</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-lock-question" color="#FFA31A">
        <span class="font-weight-bold">2020/11/06 － v1.4 Update</span>
        <ul>
          <li>feature: (???) add <strong>DARK MODE</strong>, but <i>where is it?</i></li>
          <li>ui: (Gallery) add Sheet Dialog support for Gallery</li>
          <li>misc: (About Page) add timeline for Update Record</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2020/10/31 － v1.3 Update</span>
        <ul>
          <li>feature: (Gallery) add "Gallery"</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2020/10/22 － v1.2.2 Update</span>
        <ul>
          <li>ui: (Filter) add icons to texts of different modes</li>
          <li>ui: (Grid View) add shadow, title tooltips and image scaling on mouse hover</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2020/10/20 － v1.2.1 Update</span>
        <ul>
          <li>ui: (Sheet Dialog) add tooltips for long truncated song titles</li>
          <li>ui: (Grid View) change sheets-per-page to 48 for a nicer look</li>
          <li>ui: (Grid View) ensure grid width fitting well with long level strings</li>
          <li>bugfix: (Grid View) now current page correctly reset when filters change</li>
          <li>misc: (Site) apply dynamic page title</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2020/10/16 － v1.2 Update</span>
        <ul>
          <li>feature: (Grid View) add Grid View</li>
          <li>ui: (Sheet Dialog) add sheet type icons</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item small color="grey">
        <span class="font-weight-bold">2020/10/06 － v1.1.1 Update</span>
        <ul>
          <li>bugfix: (Data) 28 missing sheets re-added</li>
          <li>bugfix: (Filter) now clearing BPM results a correct behavior</li>
          <li>ui: (List View) apply difficulty colors</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item>
        <span class="font-weight-bold">2020/09/18 － v1.1 Update</span>
        <ul>
          <li>feature: (List View) add "Open Sheet Dialog" button</li>
          <li>feature: (Sheet Dialog) add "Search on YouTube" button</li>
          <li>misc: (Site) add site counter</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item large icon="mdi-flag-variant" color="green">
        <span class="font-weight-bold">2020/08/16 － v1.0 Release</span>
        <ul>
          <li>feature: (Filter) add "Region" filter</li>
          <li>feature: (Filter) add "BPM" filter</li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-beta" color="orange">
        <span class="font-weight-bold">2020/07/30 － v0.1 Beta Test</span>
        <ul>
          <li><i>Tester 001: Glad to see you like it.</i></li>
        </ul>
      </v-timeline-item>
      <v-timeline-item icon="mdi-alpha" color="red">
        <span class="font-weight-bold">2020/07/27 － v0.0.1 Project Started</span>
        <ul>
          <li><i>This project was devoted to my friends...</i></li>
        </ul>
      </v-timeline-item>
    </v-timeline>

    <br>

    <h3>{{ $t('page.about.disclaimer') }}</h3>
    <ul>
      <template v-if="gameCode === 'maimai'">
        <li>
          <strong>maimai でらっくす</strong> and <strong>maimai DX</strong>
          are trademarks of <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>maimai でらっくす</strong> or <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'wacca'">
        <li>
          <strong>WACCA</strong> and <strong>ワッカ</strong>
          are trademarks of <strong>Marvelous Inc.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>WACCA</strong> or <strong>Marvelous Inc.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'chunithm'">
        <li>
          <strong>CHUNITHM</strong> and <strong>チュウニズム</strong>
          are trademarks of <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>CHUNITHM</strong> or <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'sdvx'">
        <li>
          <strong>SOUND VOLTEX</strong> and <strong>サウンドボルテックス</strong>
          are trademarks of <strong>Konami Amusement Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>SOUND VOLTEX</strong> or <strong>Konami Amusement Co., Ltd.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'jubeat'">
        <li>
          <strong>jubeat</strong> and <strong>ユビート</strong>
          are trademarks of <strong>Konami Amusement Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>jubeat</strong> or <strong>Konami Amusement Co., Ltd.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'taiko'">
        <li>
          <strong>太鼓の達人</strong> and <strong>たいこのたつじん</strong>
          are trademarks of <strong>BANDAI NAMCO Entertainment Inc.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>太鼓の達人</strong> or <strong>BANDAI NAMCO Entertainment Inc.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'ongeki'">
        <li>
          <strong>オンゲキ</strong> and <strong>O.N.G.E.K.I.</strong>
          are trademarks of <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>オンゲキ</strong> or <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
      </template>
      <template v-if="gameCode === 'gc'">
        <li>
          <strong>GROOVE COASTER</strong> and <strong>グルーヴコースター</strong>
          are trademarks of <strong>TAITO Corporation</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>GROOVE COASTER</strong> or <strong>TAITO Corporation</strong>
        </li>
      </template>
      <template v-if="gameCode === 'diva'">
        <li>
          <strong>Project DIVA Arcade</strong> and <strong>Future Tone</strong>
          are trademarks of <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
        <li>
          This site is not associated or officially connected with
          <strong>Project DIVA Arcade</strong> or <strong>SEGA Interactive Co., Ltd.</strong>
        </li>
      </template>
      <li>
        <div v-if="!isDarkMode">
          <strong>HOLD ON</strong> a second!
          This site contains a <i>secret</i>. Can you find it?
        </div>
        <div v-else class="yellow--text">
          <strong>You found the <i>secret</i> :D!</strong> Isn't that kinda cool :)?
        </div>
      </li>
    </ul>
  </v-container>
</template>
