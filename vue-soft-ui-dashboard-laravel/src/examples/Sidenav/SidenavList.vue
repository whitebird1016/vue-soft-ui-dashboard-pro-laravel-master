<template>
  <div
    id="sidenav-collapse-main"
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="dashboardsExamples"
          nav-text="Dashboards"
          :class="getRoute() === 'dashboards' ? 'active' : ''"
        >
          <template #icon>
            <Shop />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-item
                :to="{ name: 'Default' }"
                mini-icon="D"
                text="Default"
              />
              <sidenav-item
                :to="{ name: 'Automotive' }"
                mini-icon="A"
                text="Automotive"
              />
              <sidenav-item
                :to="{ name: 'Smart Home' }"
                mini-icon="S"
                text="Smart Home"
              />
              <sidenav-collapse-item
                refer="vrExamples"
                mini-icon="V"
                text="Virtual Reality"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'VR Default' }"
                    mini-icon="V"
                    text="VR Default"
                  />
                  <sidenav-item
                    :to="{ name: 'VR Info' }"
                    mini-icon="V"
                    text="VR Info"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-item :to="{ name: 'CRM' }" mini-icon="C" text="CRM" />
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          PAGES
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="apiExamples"
          nav-text="Examples (API)"
          :class="getRoute() === 'examples' ? 'active' : ''"
        >
          <template #icon>
            <Vue />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <sidenav-item
                :to="{ name: 'Profile' }"
                mini-icon="P"
                text="User Profile"
              />
              <sidenav-item
                v-if="requireAdmin"
                :to="{ name: 'Roles' }"
                mini-icon="R"
                text="Role Management"
              />
              <sidenav-item
                v-if="requireAdmin"
                :to="{ name: 'Users' }"
                mini-icon="U"
                text="User Management"
              />
              <sidenav-item
                v-if="requireCreator"
                :to="{ name: 'Categories' }"
                mini-icon="C"
                text="Category Management"
              />
              <sidenav-item
                v-if="requireCreator"
                :to="{ name: 'Tags' }"
                mini-icon="T"
                text="Tag Management"
              />
              <sidenav-item
                v-if="requireCreator"
                :to="{ name: 'Items' }"
                mini-icon="I"
                text="Item Management"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="pagesExamples"
          nav-text="Pages"
          :class="getRoute() === 'pages' ? 'active' : ''"
        >
          <template #icon>
            <Office />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-collapse-item
                refer="profileExample"
                mini-icon="P"
                text="Profile"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Profile Overview' }"
                    mini-icon="P"
                    text="Profile Overview"
                  />
                  <sidenav-item
                    :to="{ name: 'Teams' }"
                    mini-icon="T"
                    text="Teams"
                  />
                  <sidenav-item
                    :to="{ name: 'All Projects' }"
                    mini-icon="A"
                    text="All Projects"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="usersExample"
                mini-icon="U"
                text="Users"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Reports' }"
                    mini-icon="R"
                    text="Reports"
                  />
                  <sidenav-item
                    :to="{ name: 'New User CT' }"
                    mini-icon="N"
                    text="New User"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="accountExample"
                mini-icon="A"
                text="Account"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Settings' }"
                    mini-icon="S"
                    text="Settings"
                  />
                  <sidenav-item
                    :to="{ name: 'Billing' }"
                    mini-icon="B"
                    text="Billing"
                  />
                  <sidenav-item
                    :to="{ name: 'Invoice' }"
                    mini-icon="I"
                    text="Invoice"
                  />
                  <sidenav-item
                    :to="{ name: 'Security' }"
                    mini-icon="S"
                    text="Security"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="projectsExample"
                mini-icon="P"
                text="Projects"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'General' }"
                    mini-icon="G"
                    text="General"
                  />
                  <sidenav-item
                    :to="{ name: 'Timeline' }"
                    mini-icon="T"
                    text="Timeline"
                  />
                  <sidenav-item
                    :to="{ name: 'New Project' }"
                    mini-icon="N"
                    text="New Project"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-item
                :to="{ name: 'Pricing Page' }"
                mini-icon="P"
                text="Pricing Page"
              />
              <sidenav-item :to="{ name: 'RTL' }" mini-icon="R" text="RTL" />
              <sidenav-item
                :to="{ name: 'Widgets' }"
                mini-icon="W"
                text="Widgets"
              />
              <sidenav-item
                :to="{ name: 'Charts' }"
                mini-icon="C"
                text="Charts"
              />
              <sidenav-item
                :to="{ name: 'Sweet Alerts' }"
                mini-icon="S"
                text="Sweet Alerts"
              />
              <sidenav-item
                :to="{ name: 'Notifications' }"
                mini-icon="N"
                text="Notifications"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="applicationsExamples"
          nav-text="Applications"
          :class="getRoute() === 'applications' ? 'active' : ''"
        >
          <template #icon>
            <Settings />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->

              <sidenav-item
                :to="{ name: 'Kanban' }"
                mini-icon="K"
                text="Kanban"
              />
              <sidenav-item
                :to="{ name: 'Wizard' }"
                mini-icon="W"
                text="Wizard"
              />
              <sidenav-item
                :to="{ name: 'Data Tables' }"
                mini-icon="D"
                text="Data Tables"
              />
              <sidenav-item
                :to="{ name: 'Calendar' }"
                mini-icon="C"
                text="Calendar"
              />
              <sidenav-item
                :to="{ name: 'Analytics' }"
                mini-icon="A"
                text="Analytics"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="ecommerceExamples"
          nav-text="Ecommerce"
          :class="getRoute() === 'ecommerce' ? 'active' : ''"
        >
          <template #icon>
            <Basket />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-item
                :to="{ name: 'Overview' }"
                mini-icon="O"
                text="Overview"
              />

              <sidenav-collapse-item
                refer="productsExample"
                mini-icon="P"
                text="Products"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'New Product' }"
                    mini-icon="N"
                    text="New Product"
                  />
                  <sidenav-item
                    :to="{ name: 'Edit Product' }"
                    mini-icon="E"
                    text="Edit Product"
                  />
                  <sidenav-item
                    :to="{ name: 'Product Page' }"
                    mini-icon="P"
                    text="Product page"
                  />
                  <sidenav-item
                    :to="{ name: 'Products List' }"
                    mini-icon="P"
                    text="Products List"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="ordersExample"
                mini-icon="O"
                text="Orders"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Order List' }"
                    mini-icon="O"
                    text="Order List"
                  />
                  <sidenav-item
                    :to="{ name: 'Order Details' }"
                    mini-icon="O"
                    text="Order Details"
                  />
                </template>
              </sidenav-collapse-item>
              <sidenav-item
                :to="{ name: 'Referral' }"
                mini-icon="R"
                text="Referral"
              />
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="authExamples"
          nav-text="Authentication"
          :class="getRoute() === 'authentication' ? 'active' : ''"
        >
          <template #icon>
            <Document />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-collapse-item
                refer="signinExample"
                mini-icon="S"
                text="Sign In"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Signin Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Signin Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Signin Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="signupExample"
                mini-icon="S"
                text="Sign Up"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Signup Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Signup Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Signup Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="resetExample"
                mini-icon="R"
                text="Reset Password"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Reset Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Reset Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Reset Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="lockExample"
                mini-icon="L"
                text="Lock"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Lock Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Lock Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Lock Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="StepExample"
                mini-icon="2"
                text="2-Step Verification"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Verification Basic' }"
                    mini-icon="B"
                    text="Basic"
                  />
                  <sidenav-item
                    :to="{ name: 'Verification Cover' }"
                    mini-icon="C"
                    text="Cover"
                  />
                  <sidenav-item
                    :to="{ name: 'Verification Illustration' }"
                    mini-icon="I"
                    text="Illustration"
                  />
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="errorExample"
                mini-icon="E"
                text="Error"
              >
                <template #nav-child-item>
                  <sidenav-item
                    :to="{ name: 'Error Error404' }"
                    mini-icon="E"
                    text="Error 404"
                  />
                  <sidenav-item
                    :to="{ name: 'Error Error500' }"
                    mini-icon="E"
                    text="Error 500"
                  />
                </template>
              </sidenav-collapse-item>
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="mt-3 nav-item">
        <hr class="mt-0 horizontal dark" />
        <h6
          class="text-xs ps-4 ms-2 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          DOCS
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="basicExamples"
          nav-text="Basic"
          :class="getRoute() === 'basic' ? 'active' : ''"
        >
          <template #icon>
            <Spaceship height="20px" />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-collapse-item
                refer="gettingStartedExample"
                mini-icon="G"
                text="Getting Started"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/quick-start/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">Q</span>
                      <span class="sidenav-normal">Quick Start</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/license/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">L</span>
                      <span class="sidenav-normal">License</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/overview/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Contents</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/build-tools/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">B</span>
                      <span class="sidenav-normal">Build Tools</span>
                    </a>
                  </li>
                </template>
              </sidenav-collapse-item>

              <sidenav-collapse-item
                refer="foundationExample"
                mini-icon="F"
                text="Foundation"
              >
                <template #nav-child-item>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/colors/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">C</span>
                      <span class="sidenav-normal">Colors</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/grid/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">G</span>
                      <span class="sidenav-normal">Grid</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/typography/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">T</span>
                      <span class="sidenav-normal">Typography</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="https://www.creative-tim.com/learning-lab/bootstrap/icons/soft-ui-dashboard/"
                      target="_blank"
                    >
                      <span class="text-xs sidenav-mini-icon">I</span>
                      <span class="sidenav-normal">Icons</span>
                    </a>
                  </li>
                </template>
              </sidenav-collapse-item>
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="componentsExamples"
          nav-text="Components"
          :class="getRoute() === 'components' ? 'active' : ''"
        >
          <template #icon>
            <Box3d />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/alerts/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">A</span>
                  <span class="sidenav-normal">Alerts</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/badge/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Badge</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/buttons/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">B</span>
                  <span class="sidenav-normal">Buttons</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/cards/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Card</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/carousel/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Carousel</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/collapse/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">C</span>
                  <span class="sidenav-normal">Collapse</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/dropdowns/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">D</span>
                  <span class="sidenav-normal">Dropdowns</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/forms/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">F</span>
                  <span class="sidenav-normal">Forms</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/modal/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">M</span>
                  <span class="sidenav-normal">Modal</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/navs/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">N</span>
                  <span class="sidenav-normal">Navs</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/navbar/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">N</span>
                  <span class="sidenav-normal">Navbar</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/pagination/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Pagination</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/popovers/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Popovers</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/progress/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">P</span>
                  <span class="sidenav-normal">Progress</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/spinners/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">S</span>
                  <span class="sidenav-normal">Spinners</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/tables/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">T</span>
                  <span class="sidenav-normal">Tables</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  href="https://www.creative-tim.com/learning-lab/bootstrap/tooltips/soft-ui-dashboard/"
                  target="_blank"
                >
                  <span class="sidenav-mini-icon">T</span>
                  <span class="sidenav-normal">Tooltips</span>
                </a>
              </li>
            </ul>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          nav-text="Changelog"
          :collapse="false"
          url="#"
          :aria-controls="''"
          collapse-ref="https://github.com/creativetimofficial/ct-soft-ui-dashboard-pro/blob/main/CHANGELOG.md"
        >
          <template #icon>
            <CreditCard />
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>
  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :class="cardBg"
      text-primary="Need Help?"
      text-secondary="Please check our docs"
      route="https://vue-soft-ui-dashboard-laravel-docs.creative-tim.com/vue/overview/soft-ui-dashboard"
      label="Documentation"
      icon="ni ni-diamond"
    />
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import SidenavCollapseItem from "./SidenavCollapseItem.vue";
import Settings from "../../components/Icon/Settings.vue";
import Basket from "../../components/Icon/Basket.vue";
import Box3d from "../../components/Icon/Box3d.vue";
import Shop from "../../components/Icon/Shop.vue";
import Office from "../../components/Icon/Office.vue";
import Document from "../../components/Icon/Document.vue";
import Spaceship from "../../components/Icon/Spaceship.vue";
import CreditCard from "../../components/Icon/CreditCard.vue";
import Vue from "../../components/Icon/Vue.vue";
import { mapState } from "vuex";
export default {
  name: "SidenavList",
  components: {
    SidenavItem,
    SidenavCollapse,
    SidenavCard,
    SidenavCollapseItem,
    Settings,
    Basket,
    Box3d,
    Shop,
    Office,
    Document,
    Spaceship,
    CreditCard,
    Vue,
  },
  props: {
    cardBg: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState(["isRTL"]),
    profile() {
      return this.$store.getters["profile/profile"];
    },
    requireAdmin() {
      if (this.$store.getters["auth/loggedIn"] && this.profile) {
        if (this.profile.roles[0].name == "admin") return true;
      }

      return false;
    },
    requireCreator() {
      if (this.$store.getters["auth/loggedIn"] && this.profile) {
        const aux = this.profile.roles[0].name;
        if (aux == "admin" || aux == "creator") return true;
      }
      return false;
    },
  },
  async created() {
    if (this.$store.getters["auth/loggedIn"]) {
      try {
        await this.$store.dispatch("profile/getProfile");
        this.profileChange = { ...this.profile };
      } catch (error) {
        try {
          await this.$store.dispatch("auth/logout");
        } finally {
          this.$router.push("/login");
        }
      }
    }
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
  },
};
</script>
