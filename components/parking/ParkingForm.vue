<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mid" :class="{ 'mdi-details' : sendData.uid, 'mdi-plus': !sendData.uid }"/>
							</ScCardTitle>
						</div>
						<ScCardAction v-if="mode !== 'mypage'">
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardAction>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px">
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<!--	siteType, name  -->
							<div class="uk-width-1-2">
								<select v-model="sendData.siteType" class="uk-select" required="required">
									<option value="" disabled="disabled">주차장 유형</option>
									<option value="0">하이파킹</option>
									<option value="1">제휴</option>
									<option value="2">일반</option>
								</select>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error"
										 :validator="$v.sendData.name">
									<label>
										주차장 이름
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: pencil"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										주차장 이름을 입력하세요.
									</li>
								</ul>
							</div>
							<!--	최대 가용 대수 , 위도 경도  -->
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.parkingLot" :error-state="$v.sendData.parkingLot.$error"
										 :validator="$v.sendData.parkingLot">
									<label>
										최대가용대수
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: pencil"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.parkingLot.required">
										최대가용대수를 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.lat" :error-state="$v.sendData.lat.$error"
										 :validator="$v.sendData.lat">
									<label>
										위도
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: pencil"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.lat.required">
										위도를 입력해주세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.lon" :error-state="$v.sendData.lon.$error"
										 :validator="$v.sendData.lon">
									<label>
										경도
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: pencil"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.parkingLot.required">
										경도를 입력해주세요.
									</li>
								</ul>
							</div>
							<!--	연락처, 휴대전화        -->
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.tel">
									<label>
										연락처
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: receiver"/>
								</ScInput>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.phone">
									<label>
										휴대전화
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: phone"/>
								</ScInput>
							</div>
							<!--	이메일, 담당자이름      -->
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.email" v-input-mask="{ 'alias': 'email' }">
									<label>
										이메일
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"/>
								</ScInput>
							</div>
							<!--	이용가능여부, 기준가격  -->
							<div class="uk-width-1-2">
								<input id="switch-css" v-model="sendData.isActive" type="checkbox"
									   class="sc-switch-input">
								<label for="switch-css" class="sc-switch-label"
									   style="margin-top:15px;margin-left:15px;">
									<span class="sc-switch-toggle-on">운영중</span>
									<span class="sc-switch-toggle-off">미운영</span>
								</label>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.price">
									<label>
										기준가격
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
							</div>
							<!--    주소                    -->
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.address">
									<label>
										주소
									</label>
								</ScInput>
							</div>
							<!--    주차장 안내             -->
							<div class="uk-width-1-1">
								<ScTextarea
									v-model="sendData.info"
									:cols="30"
									:rows="6"
									:autosize="true"
									mode="outline"
								>
									<label>주차장 안내 입력</label>
								</ScTextarea>
							</div>
							<!--    요금 안내               -->
							<div class="uk-width-1-1">
								<ScTextarea
									v-model="sendData.priceInfo"
									:cols="30"
									:rows="6"
									:autosize="true"
									mode="outline"
								>
									<label>요금 안내 입력</label>
								</ScTextarea>
							</div>
							<!--    주차장 이미지           -->

							<!--    결제태그-->
							<!--    제휴태그-->
							<!--   	상품태그-->
							<!--    옵션태그-->
							<!--    차량태그-->
						</form>
					</div>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import ScCard from "@/components/card/components/Card";
	import ScInput from "@/components/Input";

	export default {
		name: "ParkingForm",
		components: {ScInput, ScCard}
	}
</script>

<style scoped>

</style>
