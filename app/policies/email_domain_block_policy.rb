# frozen_string_literal: true

class EmailDomainBlockPolicy < ApplicationPolicy
  def index?
    admin?
  end

  def create?
    admin?
  end

  def destroy?
    admin?
  end
end
